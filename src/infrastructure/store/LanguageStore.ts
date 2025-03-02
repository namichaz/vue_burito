import ELanguageType from "@/domain/model/lang/ELanguageType";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useLanguageStore = defineStore(
  "language",
  () => {
    const languageValue = ref(ELanguageType.NONE);

    const language = () => {
      return languageValue.value;
    };

    const setLanguage = (language: ELanguageType) => {
      languageValue.value = language;
      window.sessionStorage.setItem("Language", languageValue.value);
    };

    const load = () => {
      const savedLanguage = window.sessionStorage.getItem("Language");
      if (!savedLanguage) return;
      languageValue.value = savedLanguage as ELanguageType;
    };

    return {
      language,
      setLanguage,
      load,
    };
  },
  {
    persist: true,
  }
);
