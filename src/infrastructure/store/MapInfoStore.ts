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

    return {
      isShowFirst,
      setShowFirst,
    };
  },
  {
    persist: true,
  }
);
