import { defineStore } from "pinia";
import { ref } from "vue";

export const useMapInfoStore = defineStore(
  "mapInfo",
  () => {
    const isShow = ref<boolean>(true);

    const isShowFirst = () => {
      return isShow.value;
    };

    const setShowFirst = (isShowValue: boolean) => {
      isShow.value = isShowValue;
    };

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

    return {
      isShowFirst,
      setShowFirst,
      getCurrentLocation,
    };
  },
  {
    persist: true,
  }
);
