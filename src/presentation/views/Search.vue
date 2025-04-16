<template>
  <div class="pa-5 search">
    <h1 class="pa-5" v-html="t('search.page_title')" />
    <div class="inputArea">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="t('search.enter_keywords')"
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
        v-html="t('search.return_to_current_location')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onBeforeMount, nextTick } from "vue";
import { useShopInfoStore } from "@/infrastructure/store/ShopInfoStore";
import { useMapInfoStore } from "@/infrastructure/store/MapInfoStore";
import ShopInfo from "@/domain/model/shop/ShopInfo";
import burrito from "@/presentation/assets/burrito.svg";
import ShopListTransfer from "@/infrastructure/network/shop/ShopListTransfer";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const storeShopInfo = useShopInfoStore();
const storeMapInfo = useMapInfoStore();
const shopListTransfer = new ShopListTransfer();
const searchQuery = ref<string>(""); // 検索クエリを保持するref
const initialMarkers = [{ lat: 0, lng: 0, title: "" }];
const shopList = ref<ShopInfo[]>([]);

let shopInfos = ref<ShopInfo[]>([]);
let map: google.maps.Map; // google.maps.Map型に変更
let service: google.maps.places.PlacesService; // google.maps.places.PlacesService型に変更
let markers: google.maps.Marker[] = []; // google.maps.Marker[]型に変更（マーカーの配列）
let infoWindow: google.maps.InfoWindow; // google.maps.InfoWindow型に変更

const emit = defineEmits<{
  (e: "showLoading"): void;
  (e: "hideLoading"): void;
}>();

//TODO 現在位置を取得する関数
const getCurrentLocation = (): Promise<GeolocationPosition> => {
  try {
    // emit("showLoading");
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          { enableHighAccuracy: true, timeout: 10000 } // 高精度を避け、タイムアウトを設定
        );
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  } finally {
  }
};

//TODO 現在位置移動する関数
const moveToCurrentLocation = async () => {
  try {
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
  }
};

//TODO 登録されてるお店のマーカー用の緯度経度情報作る関数
const buildMarkerData = async () => {
  shopInfos.value = await storeShopInfo.getShopInfos();
  for (var shopInfo of shopInfos.value) {
    let param = {
      lat: shopInfo.address.longitude,
      lng: shopInfo.address.latitude,
      title: shopInfo.shop.shop_name,
    };
    await initialMarkers.push(param);
  }
  console.log("onBeforeMountの中initialMarkers=", initialMarkers);
};

//TODO onBeforeMount
onBeforeMount(async () => {
  try {
    shopList.value = await shopListTransfer.getShopList();
    if (shopList.value.length === 0) return;
    storeShopInfo.setShopInfos(shopList.value);
  } catch (error) {
    console.error("店舗情報の取得エラー:", error);
  } finally {
    nextTick(() => {
      window.scrollTo(0, 0);
    });
  }
  buildMarkerData();
});

//TODO onMounted
onMounted(async () => {
  storeShopInfo.isPostValue = true;
  let position: GeolocationPosition | null = null; // 初期値を null に設定
  try {
    emit("showLoading");

    if (typeof google === "undefined" || typeof google.maps === "undefined") {
      console.error("Google Maps API is not loaded.");
      return;
    }
    position = await getCurrentLocation();

    if (!position) {
      throw new Error(t("search.cant_get_current_place").toString());
    }

    const lnt = storeShopInfo.getLongitude();
    const lat = storeShopInfo.getLatitude();

    const currentLatLng = new google.maps.LatLng(
      storeShopInfo.isFromList() ? lat : position.coords.latitude,
      storeShopInfo.isFromList() ? lnt : position.coords.longitude
    );

    const Options: google.maps.MapOptions = {
      zoom: 15,
      center: currentLatLng, // 現在地を中心に設定
      mapTypeId: "roadmap",
    };
    map = new google.maps.Map(document.getElementById("map")!, Options);
    let currentMarker = new google.maps.Marker();

    if (storeShopInfo.isFromList()) {
      currentMarker = new google.maps.Marker({
        position: currentLatLng,
        map: map,
        title: storeShopInfo.getShopName(),
        icon: {
          url: burrito, // SVGのURLを指定
          scaledSize: new google.maps.Size(40, 40), // アイコンのサイズを指定
        } as google.maps.Icon,
        animation: google.maps.Animation.DROP,
      });
    } else {
      // 現在地にマーカーを設定
      currentMarker = new google.maps.Marker({
        position: currentLatLng,
        map: map,
        title: "現在地",
      });
    }
    // 現在地のマーカーがクリックされたらInfoWindowを表示
    infoWindow = new google.maps.InfoWindow();

    if (storeShopInfo.isFromList()) {
      currentMarker.addListener("click", () => {
        infoWindow.setContent(
          `<div style="color: black;width:auto; height:50px;"><strong>${storeShopInfo.getShopName()}</strong>`
        );
        infoWindow.open(map, currentMarker);
      });
    } else {
      currentMarker.addListener("click", () => {
        infoWindow.setContent(
          `<div style="color: black;width:auto; height:50px;"><strong>現在地</strong>`
        );
        infoWindow.open(map, currentMarker);
      });
    }
    setTimeout(() => {
      // 初期位置にマーカーを配置
      initialMarkers.forEach((marker) => {
        console.log(initialMarkers.length);
        console.log("marker=", marker);
        const position = new google.maps.LatLng(marker.lat, marker.lng);
        const googleMarker = new google.maps.Marker({
          position,
          map: map,
          title: marker.title,
          icon: {
            url: burrito, // SVGのURLを指定
            scaledSize: new google.maps.Size(40, 40), // アイコンのサイズを指定
          } as google.maps.Icon,
        });
        markers.push(googleMarker);
        googleMarker.addListener("click", () => {
          infoWindow.setContent(
            `<div style="color: black;width:auto; height:50px;"><strong>${marker.title}</strong>`
          );
          infoWindow.open(map, googleMarker);
        });
      });
    }, 1000);

    if (position) emit("hideLoading");
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

    const initialMarkers = [
      { lat: 34.70967626120183, lng: 135.4974168117349, title: "大阪" },
    ];

    initialMarkers.forEach((marker) => {
      const position = new google.maps.LatLng(marker.lat, marker.lng);
      const googleMarker = new google.maps.Marker({
        position,
        map: map,
        title: marker.title,
      });
      markers.push(googleMarker);

      googleMarker.addListener("click", () => {
        infoWindow.setContent(
          `<div style="color: black;width:auto; height:50px;"><strong>${marker.title}</strong>`
        );
        infoWindow.open(map, googleMarker);
      });
    });
    emit("hideLoading");
  } finally {
    storeShopInfo.isList = false;
    storeMapInfo.setShowFirst(false);
  }
});

//TODO 検索処理
const searchLocation = () => {
  console.log("search");
  if (searchQuery.value.trim() === "") {
    alert(t("search.please_enter_keywords").toString());
    return;
  }
  const request = {
    query: searchQuery.value,
    fields: ["geometry", "name"],
  };
  // PlacesServiceを作成
  service = new google.maps.places.PlacesService(map);

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
        } else {
          alert(t("search.nothing_location").toString());
        }

        setTimeout(() => {
          // 初期位置にマーカーを配置
          initialMarkers.forEach((marker) => {
            console.log(initialMarkers.length);
            console.log("marker=", marker);
            const position = new google.maps.LatLng(marker.lat, marker.lng);
            const googleMarker = new google.maps.Marker({
              position,
              map: map,
              title: marker.title,
              icon: {
                url: burrito, // SVGのURLを指定
                scaledSize: new google.maps.Size(40, 40), // アイコンのサイズを指定
              } as google.maps.Icon,
            });
            markers.push(googleMarker);
            googleMarker.addListener("click", () => {
              infoWindow.setContent(
                `<div style="color: black;width:auto; height:50px;"><strong>${marker.title}</strong>`
              );
              infoWindow.open(map, googleMarker);
            });
          });
        }, 1000);
      } catch {
        console.log("場所の取得中にエラーが発生しました。");
      } finally {
        emit("hideLoading");
        searchQuery.value = "";
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
