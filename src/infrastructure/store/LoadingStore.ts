import { defineStore } from "pinia";
import { ref } from "vue";

export const useLoadingStore = defineStore(
  "loading",
  () => {
    const isLoadingvalue = ref(false);

    const isLoading = () => {
      return isLoadingvalue.value;
    };

    const start = () => {
      isLoadingvalue.value = true;
    };

    const fin = () => {
      isLoadingvalue.value = false;
    };

    return {
      isLoading,
      start,
      fin,
    };
  },
  {
    persist: true,
  }
);
