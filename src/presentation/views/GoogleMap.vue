<template>
  <v-main>
    <v-row>
      <v-card class="mx-auto" color="surface-light" max-width="100%">
        <v-card-text>
          <v-text-field
            :loading="loading"
            append-inner-icon="mdi-magnify"
            density="compact"
            label="Search templates"
            variant="solo"
            hide-details
            single-line
            @click:append-inner="searchPlaces"
          ></v-text-field>
        </v-card-text>
      </v-card>
      hello
    </v-row>
    <v-row>
      <div id="map" style="width: 100%; height: 100vh"></div>
    </v-row>
  </v-main>
</template>

<script>
export default {
  name: "GoogleMap",
  data() {
    return {
      lat: null, // 現在地の緯度
      lng: null, // 現在地の経度
      clickedLat: null, // クリックした位置の緯度
      clickedLng: null, // クリックした位置の経度
      searchQuery: "", // 検索キーワード
      map: null, // 地図オブジェクト
      currentLocationMarker: null, // 現在地のマーカー
      placesService: null, // Places APIサービス
      markers: [], // 検索結果のマーカーを保持
    };
  },
  mounted() {
    const MyLatLng = new google.maps.LatLng(
      34.70967626120183,
      135.4974168117349
    ); // 初期位置（例: 大阪）
    const Options = {
      zoom: 15,
      center: MyLatLng,
      mapTypeId: "roadmap",
    };

    this.map = new google.maps.Map(document.getElementById("map"), Options);
    this.placesService = new google.maps.places.PlacesService(this.map);

    // 現在地を取得して地図に表示
    this.getCurrentLocation();

    // 地図クリック時のイベントリスナー
    this.map.addListener("click", (event) => {
      const clickedLat = event.latLng.lat(); //選択した位置の緯度
      const clickedLng = event.latLng.lng(); //選択した位置の経度

      // クリックした位置にマーカーを追加
      new google.maps.Marker({
        position: { lat: clickedLat, lng: clickedLng },
        map: this.map,
        title: "Selected Point",
      });

      // クリックした位置の緯度経度を状態に保存
      this.clickedLat = clickedLat;
      this.clickedLng = clickedLng;
    });
  },
  methods: {
    // 現在地を取得するメソッド
    getCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            // 現在地を地図のセンターに設定
            this.map.setCenter(pos);

            // 現在地にマーカーを追加
            if (this.currentLocationMarker) {
              this.currentLocationMarker.setPosition(pos);
            } else {
              this.currentLocationMarker = new google.maps.Marker({
                position: pos,
                map: this.map,
                title: "Your Location",
              });
            }

            // 現在地の緯度・経度を状態に保存
            this.lat = pos.lat;
            this.lng = pos.lng;
          },
          () => {
            alert("現在地の取得に失敗しました。");
          }
        );
      } else {
        alert("このブラウザでは位置情報がサポートされていません。");
      }
    },

    // キーワード検索を実行するメソッド
    searchPlaces() {
      if (!this.searchQuery.trim()) {
        alert("検索キーワードを入力してください");
        return;
      }
      // 以前のマーカーを全て削除
      this.clearMarkers();

      // 現在地が設定されていれば、その位置を基準に検索
      const request = {
        location: new google.maps.LatLng(this.lat, this.lng),
        radius: 5000, // 半径5km以内の店舗を検索
        keyword: this.searchQuery, // 入力されたキーワードで検索
      };

      // Google Places APIで検索を実行
      this.placesService.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          results.forEach((place) => {
            // 店舗の位置にマーカーを追加
            const marker = new google.maps.Marker({
              position: place.geometry.location,
              map: this.map,
              title: place.name,
            });

            // マーカーを配列に追加
            this.markers.push(marker);
          });
        } else {
          console.log("検索に失敗しました:", status);
          alert("検索に失敗しました。再試行してください。");
        }
      });
    },

    // 既存のマーカーをクリアするメソッド
    clearMarkers() {
      this.markers.forEach((marker) => marker.setMap(null));
      this.markers = []; // マーカー配列をリセット
    },
  },
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
  @media screen and (min-width: 300px) {
    width: 40px;
    height: 40px;
  }
}
</style>
