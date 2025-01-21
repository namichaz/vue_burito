<template>
  <div>
    <h1>Google Maps in Vue (Vite)</h1>
    <!-- 地図を表示するための div -->
    <div id="map" style="width: 1000px; height: 1000px"></div>
  </div>
</template>

<script>
export default {
  name: "GoogleMap",
  mounted() {
    var MyLatLng = new google.maps.LatLng(34.70967626120183, 135.4974168117349);
    var Options = {
      zoom: 15, //地図の縮尺値
      center: MyLatLng, //地図の中心座標
      mapTypeId: "roadmap", //地図の種類
    };
    var map = new google.maps.Map(document.getElementById("map"), Options);
    console.log("map=", map);
  },
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
