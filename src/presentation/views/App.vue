<template>
  <header>
    <div class="loop-wrap">
      <ul class="loop-area">
        <li class="content">Where's my best burrito!?</li>
        <li class="content">Where's my best burrito!?</li>
        <li class="content">Where's my best burrito!?</li>
        <li class="content">Where's my best burrito!?</li>
      </ul>
      <ul class="loop-area">
        <li class="content">Where's my best burrito!?</li>
        <li class="content">Where's my best burrito!?</li>
        <li class="content">Where's my best burrito!?</li>
        <li class="content">Where's my best burrito!?</li>
      </ul>
      <ul class="loop-area">
        <li class="content">Where's my best burrito!?</li>
        <li class="content">Where's my best burrito!?</li>
        <li class="content">Where's my best burrito!?</li>
        <li class="content">Where's my best burrito!?</li>
      </ul>
    </div>
  </header>
  <v-app>
    <v-btn-toggle group v-model="selectedLang">
      <v-btn
        :value="ELanguageType.JAJP"
        :class="{ 'inactive-btn': selectedLang !== ELanguageType.JAJP }"
        selected
      >
        JA</v-btn
      >
      <v-btn
        :value="ELanguageType.ENUS"
        :class="{ 'inactive-btn': selectedLang !== ELanguageType.ENUS }"
      >
        EN
      </v-btn>
    </v-btn-toggle>

    <v-main id="main" class="px-5">
      <router-view
        @showLoading="showLoading"
        @hideLoading="hideLoading"
        @showMessageBox="showMessageBox"
        @showMessageBox2="showMessageBox2"
        @showErrorMessageWithCallBack="showErrorMessageWithCallBack"
        @showConfirm="showConfirm"
        @toOtherPage="toOtherPage"
      ></router-view>
    </v-main>
  </v-app>
  <footer>
    <nav>
      <ul>
        <li @click="toOtherPage('howto')">
          <img :src="home" alt="" />
          <p>Home</p>
        </li>
        <li @click="toOtherPage('search')">
          <img :src="search" alt="" />
          <p>Search</p>
        </li>
        <li @click="toOtherPage('list')">
          <img :src="chart" alt="" />
          <p>List</p>
        </li>
        <li @click="toOtherPage('post')">
          <img :src="plus" alt="" />
          <p>Add</p>
        </li>
      </ul>
    </nav>
  </footer>
</template>

<script setup lang="ts">
import chart from "@/presentation/assets/chart.svg";
import home from "@/presentation/assets/home.svg";
import search from "@/presentation/assets/search.svg";
import plus from "@/presentation/assets/plus.svg";
import { useRouter } from "vue-router";
import { ElLoading, ElMessageBox } from "element-plus";
import ElMessageBoxType from "@/domain/model/lang/ElMessageBoxType";
import "element-plus/dist/index.css";
import { LoadingInstance } from "element-plus/es/components/loading/src/loading";
import { useLoadingStore } from "@/infrastructure/store/LoadingStore";
import { nextTick, onMounted, ref, watch } from "vue";
import ShopListTransfer from "@/infrastructure/network/shop/ShopListTransfer";
import ShopInfo from "@/domain/model/shop/ShopInfo";
import { useShopInfoStore } from "@/infrastructure/store/ShopInfoStore";
import ELanguageType from "@/domain/model/lang/ELanguageType";
import { useLanguageStore } from "@/infrastructure/store/LanguageStore";
import { useI18n } from "vue-i18n";

const router = useRouter();
const storeLoading = useLoadingStore();
let loadingInstance: LoadingInstance | null = null;
const shopList = ref<ShopInfo[]>([]);
const shopListTransfer = new ShopListTransfer();
const storeShopInfo = useShopInfoStore();
const storeLanguage = useLanguageStore();
const languageList = ref<ELanguageType[]>([]);
const { t, locale } = useI18n();
const selectedLang = ref<ELanguageType | null>(ELanguageType.JAJP);

const showLoading = () => {
  console.log("showloading");
  setTimeout(() => {}, 100000);
  storeLoading.start();
  loadingInstance = ElLoading.service({
    lock: true,
    text: "読み込み中...",
    background: "rgba(0, 0, 0, 0.7)",
  });
};

const hideLoading = () => {
  console.log("hideloading");
  storeLoading.fin();
  if (!loadingInstance) return;
  loadingInstance.close();
  loadingInstance = null;
};

const showMessageBox = async (
  type: ElMessageBoxType,
  title: string,
  message: string
) => {
  hideLoading();
  try {
    await ElMessageBox({
      autofocus: false,
      title: title.split("&nbsp;").join(" "),
      message,
      type,
      dangerouslyUseHTMLString: true,
      showClose: false,
      confirmButtonText: "OK",
    });
  } catch (e) {}
};

const showErrorMessageWithCallBack = async (
  type: ElMessageBoxType,
  title: string,
  message: string,
  callback: () => void
) => {
  await ElMessageBox({
    autofocus: false,
    title: title.split("&nbsp;").join(" "),
    message,
    type,
    dangerouslyUseHTMLString: true,
    showClose: false,
    showCancelButton: true,
    confirmButtonText: "OK",
    callback: callback,
  });
};

const showMessageBox2 = async (
  type: ElMessageBoxType,
  title: string,
  message: string,
  confirmLabel: string,
  callback: () => void
) => {
  await ElMessageBox({
    autofocus: false,
    title: title.split("&nbsp;").join(" "),
    message,
    type,
    dangerouslyUseHTMLString: true,
    callback: (action: any) => {
      if (action === "confirm") {
        callback();
      }
    },
    showClose: false,
    confirmButtonText: confirmLabel,
  });
};

const showConfirm = async (
  type: ElMessageBoxType,
  title: string,
  message: string,
  confirmLabel: string,
  cancelLabel: string,
  callback: () => void
) => {
  await ElMessageBox({
    autofocus: false,
    title: title.split("&nbsp;").join(" "),
    message,
    type,
    dangerouslyUseHTMLString: true,
    callback: (action: any) => {
      if (action === "confirm") {
        callback();
      }
    },
    showClose: false,
    showCancelButton: true,
    cancelButtonText: cancelLabel,
    confirmButtonText: confirmLabel,
  });
};

const toOtherPage = async (pageName: string, shopInfo?: ShopInfo) => {
  try {
    await router.push(`/${pageName}`);
  } catch (error) {
    console.error("Navigation error:", error);
  }
};

const createLanguageList = () => {
  if (router.currentRoute.value.name !== "top") {
    languageList.value.push(ELanguageType.JAJP);
    languageList.value.push(ELanguageType.ENUS);
  }
};

const queryLanguage = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const queryLang = queryParams.get("lang");
  if (!queryLang) return ELanguageType.NONE;
  const lang = Array.isArray(queryLang)
    ? queryLang[0]!.replace("-", "").toLoweCase()
    : queryLang!.replace("-", "").toLowerCase();
  if (lang === ELanguageType.JAJP) return ELanguageType.JAJP;
  if (lang === ELanguageType.ENUS) return ELanguageType.ENUS;
  return ELanguageType.ENUS;
};

const changeLanguage = (lang: ELanguageType) => {
  // 言語を変更
  storeLanguage.setLanguage(lang);
  const description = t("header.meta_description").toString();
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", description);
  const keywords = t("header.meta_keywords").toString();
  document
    .querySelector('meta[name="keywords"]')
    ?.setAttribute("content", keywords);
  document.title =
    router.currentRoute.value.name === "top"
      ? t("top.page_title").toString().split("&nbsp;").join(" ")
      : t("common.page_title").toString().split("&nbsp;").join(" ");

  // 言語を反映させる
  locale.value = lang;
};

const acceptLanguage = () => {
  if (navigator.language) {
    for (const lang of navigator.languages) {
      if (lang.indexOf("ja") === 0) return ELanguageType.JAJP;
      if (lang.indexOf("en") === 0) return ELanguageType.ENUS;
    }
  } else {
    const lang = navigator.language;
    if (lang.indexOf("ja") === 0) return ELanguageType.JAJP;
    if (lang.indexOf("en") === 0) return ELanguageType.ENUS;
  }
  return ELanguageType.ENUS;
};

watch(selectedLang, (newLang) => {
  if (newLang) {
    changeLanguage(newLang);
  }
});

const initLanguage = () => {
  createLanguageList();
  storeLanguage.load();
  if (storeLanguage.language() !== ELanguageType.NONE)
    return changeLanguage(storeLanguage.language());
  const queryLanguageValue = queryLanguage();
  if (queryLanguageValue !== ELanguageType.NONE)
    return changeLanguage(queryLanguageValue);
  changeLanguage(acceptLanguage());
};

initLanguage();

onMounted(async () => {
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
});
</script>

<style lang="scss" scope>
header {
  height: 60px;
  background-color: #773a00;
  font-size: 30px;
  color: black;
  position: sticky;
  top: 0;
  z-index: 100;
}
.v-btn-toggle {
  right: 0;
  top: 0;
  position: absolute;
  background-color: transparent;
  .v-btn {
    background-color: transparent;
    color: white;
  }
  .inactive-btn {
    color: rgba(0, 0, 0, 0.4) !important; /* 薄く表示 */
    opacity: 0.6 !important; /* 薄く見せる */
  }
  .v-btn--active {
    background-color: transparent !important;
    .v-btn__overlay {
      opacity: 0 !important;
    }
  }
}
.loop-wrap {
  display: flex;
  align-items: center;
  overflow: hidden;
  height: 50px;
}
.loop-area {
  display: flex;
  animation: loop-slide 30s infinite linear 1s both;
  list-style: none;
  margin: 0;
  padding: 0;
}
.loop-area .content {
  width: 500px;
}
@keyframes loop-slide {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}
#main {
  /* height: calc(100vh - 120px); */
  height: auto;
  /* background-color: mediumseagreen; */
  background-color: #569cdb;
  display: grid;
  justify-content: center;
  color: white;
  padding-top: 20px;
  @media (max-width: 400px), (max-height: 400px) {
    height: auto;
  }
}
footer {
  position: sticky;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: #773a00;
  color: black;
  nav {
    padding: 6px;
  }
  ul {
    display: inline-flex;
    list-style: none;
    column-gap: 3rem;
    li {
      padding-top: 4px;
      &:hover {
        opacity: 0.5;
        cursor: pointer;
      }
    }
    img {
      height: 25px;
      width: 25px;
    }
  }
}
.el-popup-parent--hidden {
  width: 100% !important;
}
.el-overlay-message-box {
  .el-message-box {
    .el-icon {
      width: 30px;
      height: 30px;
      display: flex;
    }
    .el-message-box__container {
      display: flex;
    }
    .el-message-box__header {
      padding-bottom: 0px;
      font-size: 24px;
      .el-message-box__headerbtn {
        width: 16px;
        height: 16px;
        margin: 16px;
        .el-message-box__close {
          @media (hover: hover) {
            &:hover {
              color: rgb(0, 140, 214);
            }
          }
          @media (hover: none) {
            &:active {
              color: rgb(0, 140, 214);
            }
          }
        }
      }
    }
    .el-message-box__content {
      padding-top: 10px;
      .el-message-box__message {
        word-break: break-word;
      }
    }
    .el-message-box__btns {
      .el-button {
        @media (hover: hover) {
          &:hover {
            opacity: 0.7;
          }
        }
        @media (hover: none) {
          &:active {
            opacity: 0.7;
          }
        }
      }
      .el-button {
        color: black;
      }
      .el-button--primary {
        background-color: #0171a6;
        border: none;
        color: white;
      }
    }
  }
}
</style>
