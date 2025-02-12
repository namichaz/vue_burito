<template>
  <div class="pa-5 search">
    <div class="inputArea">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="キーワードを入力"
        @keyup.enter="searchLocation"
      />
      <button @click="searchLocation" type="button" aria-label="検索"></button>
    </div>
    <div id="mapArea">
      <div id="map"></div>
      <v-btn
        class="initButton"
        variant="elevated"
        @click="moveToCurrentLocation"
      >
        現在地に戻る
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useShopInfoStore } from "@/infrastructure/store/ShopInfoStore";

const storeShopInfo = useShopInfoStore();
const searchQuery = ref<string>(""); // 検索クエリを保持するref
let map: google.maps.Map; // google.maps.Map型に変更
let service: google.maps.places.PlacesService; // google.maps.places.PlacesService型に変更
let markers: google.maps.Marker[] = []; // google.maps.Marker[]型に変更（マーカーの配列）
let infoWindow: google.maps.InfoWindow; // google.maps.InfoWindow型に変更

const emit = defineEmits<{
  (e: "showLoading"): void;
  (e: "hideLoading"): void;
}>();

// 現在位置を取得する関数
const getCurrentLocation = (): Promise<GeolocationPosition> => {
  try {
    emit("showLoading");
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  } finally {
    emit("hideLoading");
  }
};

const moveToCurrentLocation = async () => {
  try {
    emit("showLoading");
    const position: GeolocationPosition = await getCurrentLocation();
    const currentLatLng = new google.maps.LatLng(
      position.coords.latitude,
      position.coords.longitude
    );

    const Options: google.maps.MapOptions = {
      zoom: 15,
      center: currentLatLng, // 現在地を中心に設定
      mapTypeId: "roadmap",
    };
    map = new google.maps.Map(document.getElementById("map")!, Options);

    // 現在地にマーカーを設定
    const currentMarker = new google.maps.Marker({
      position: currentLatLng,
      map: map,
      title: "現在地",
    });
  } finally {
    emit("hideLoading");
  }
};

// 初期マップ設定
onMounted(async () => {
  storeShopInfo.isPostValue = true;
  try {
    emit("showLoading");
    if (typeof google === "undefined" || typeof google.maps === "undefined") {
      console.error("Google Maps API is not loaded.");
      return;
    }
    // 現在地を取得
    const position: GeolocationPosition = await getCurrentLocation();
    const currentLatLng = new google.maps.LatLng(
      position.coords.latitude,
      position.coords.longitude
    );

    const Options: google.maps.MapOptions = {
      zoom: 15,
      center: currentLatLng, // 現在地を中心に設定
      mapTypeId: "roadmap",
    };
    map = new google.maps.Map(document.getElementById("map")!, Options);

    // 現在地にマーカーを設定
    const currentMarker = new google.maps.Marker({
      position: currentLatLng,
      map: map,
      title: "現在地",
    });

    // 現在地のマーカーがクリックされたらInfoWindowを表示
    infoWindow = new google.maps.InfoWindow();
    currentMarker.addListener("click", () => {
      infoWindow.setContent(
        `<div style="color: black;"><strong>現在地</strong><br>緯度: ${currentLatLng.lat()}<br>経度: ${currentLatLng.lng()}</div>`
      );
      infoWindow.open(map, currentMarker);
    });

    // 最初にピンを配置（例: 大阪、東京）
    const initialMarkers = [
      { lat: 34.70967626120183, lng: 135.4974168117349, title: "大阪" }, // 大阪
      { lat: 35.6762, lng: 139.6503, title: "東京" }, // 東京
      { lat: 34.6742537, lng: 135.4958855, title: "El Zocalo Burrito" }, // お店の例
    ];

    // 初期位置にマーカーを配置
    initialMarkers.forEach((marker) => {
      const position = new google.maps.LatLng(marker.lat, marker.lng);
      const googleMarker = new google.maps.Marker({
        position,
        map: map,
        title: marker.title,
      });
      markers.push(googleMarker); // markers 配列に追加

      // マーカーがクリックされたときの動作
      googleMarker.addListener("click", () => {
        // InfoWindowの内容を設定
        infoWindow.setContent(
          `<div style="color: black; height:200px;"><strong>${marker.title}</strong><br>緯度: ${marker.lat}<br>経度: ${marker.lng}</div>`
        );
        infoWindow.open(map, googleMarker); // マーカーに関連付けてInfoWindowを表示
      });
    });

    // PlacesServiceを作成
    service = new google.maps.places.PlacesService(map);
  } catch (error) {
    console.error("現在地取得エラー:", error);
    // 現在地が取得できなかった場合は大阪を初期表示にする
    const MyLatLng = new google.maps.LatLng(
      34.70967626120183,
      135.4974168117349
    ); // 初期位置（例: 大阪）
    const Options: google.maps.MapOptions = {
      zoom: 15,
      center: MyLatLng,
      mapTypeId: "roadmap",
    };
    map = new google.maps.Map(document.getElementById("map")!, Options);

    // 最初にピンを配置（例: 大阪、東京）
    const initialMarkers = [
      { lat: 34.70967626120183, lng: 135.4974168117349, title: "大阪" }, // 大阪
      { lat: 35.6762, lng: 139.6503, title: "東京" }, // 東京
      { lat: 34.6742537, lng: 135.4958855, title: "El Zocalo Burrito" }, // お店の例
    ];

    // 初期位置にマーカーを配置
    initialMarkers.forEach((marker) => {
      const position = new google.maps.LatLng(marker.lat, marker.lng);
      const googleMarker = new google.maps.Marker({
        position,
        map: map,
        title: marker.title,
      });
      markers.push(googleMarker); // markers 配列に追加

      // マーカーがクリックされたときの動作
      googleMarker.addListener("click", () => {
        // InfoWindowの内容を設定
        infoWindow.setContent(
          `<div style="color: black; height:200px;"><strong>${marker.title}</strong><br>緯度: ${marker.lat}<br>経度: ${marker.lng}</div>`
        );
        infoWindow.open(map, googleMarker); // マーカーに関連付けてInfoWindowを表示
      });
    });
  } finally {
    emit("hideLoading");
  }
});

// 検索処理
const searchLocation = () => {
  if (searchQuery.value.trim() === "") {
    alert("検索キーワードを入力してください");
    return;
  }

  const request = {
    query: searchQuery.value,
    fields: ["geometry", "name"],
  };

  // 検索を実行
  service.findPlaceFromQuery(
    request,
    (
      results: google.maps.places.PlaceResult[] | null,
      status: google.maps.places.PlacesServiceStatus
    ) => {
      try {
        emit("showLoading");
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          // 検索結果の位置（緯度経度）を取得
          const location = results[0].geometry!.location;
          map.setCenter(location!); // マップをその位置に移動
          map.setZoom(15); // ズームレベルを設定

          // 新しいマーカーを追加
          const newMarker = new google.maps.Marker({
            map: map,
            position: location,
            title: results[0].name,
          });

          // 新しいマーカーにクリックイベントを追加
          newMarker.addListener("click", () => {
            infoWindow.setContent(
              `<div style="color: black;"><strong>${
                results[0].name
              }</strong><br>緯度: ${location!.lat()}<br>経度: ${location!.lng()}</div>`
            );
            infoWindow.open(map, newMarker);
          });

          // 既存のマーカーも表示したまま
          markers.forEach((existingMarker) => {
            existingMarker.setMap(map); // 既存のマーカーを表示
          });

          // 新しいマーカーを追加
          markers.push(newMarker);
        } else {
          alert("場所が見つかりませんでした。");
        }
      } catch {
        console.log("場所の取得中にエラーが発生しました。");
      } finally {
        emit("hideLoading");
      }
    }
  );
};
</script>

<style lang="scss" scoped>
.search {
  max-width: 500px;
  height: auto;
  .inputArea {
    display: flex;
    padding: 5px 0;
    align-items: center;

    input {
      background-color: lightgray;
      width: 400px;
      height: 40px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-right: 10px;

      @media (max-width: 400px) {
        width: 300px;
      }
    }

    button {
      width: 40px;
      height: 40px;
      background-color: #e5e7eb;
      border-radius: 5px;
      position: relative;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.8;
      }

      /* 虫眼鏡アイコン */
      &::after {
        content: "";
        display: block;
        width: 20px;
        height: 20px;
        background-image: url("@/presentation/assets/search.svg");
        background-size: contain;
        background-repeat: no-repeat;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }

  #mapArea {
    position: relative;
    #map {
      height: 700px;
      @media (max-width: 400px) {
        width: 350px;
      }
    }
    .initButton {
      position: absolute;
      top: 60px;
      left: 10px;
      color: black;
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.8;
      }
    }
  }
}
</style>
