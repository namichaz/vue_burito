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
    <v-main id="main" class="px-5">
      <router-view
        @showLoading="showLoading"
        @hideLoading="hideLoading"
        @showMessageBox="showMessageBox"
        @showErrorMessageConfirmWithCallBack="
          showErrorMessageConfirmWithCallBack
        "
        @showConfirm="showConfirm"
        @toOtherPage="toOtherPage"
      ></router-view>
    </v-main>
  </v-app>
  <footer>
    <nav>
      <ul>
        <li @click="toOtherPage('')">
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
          <p>Post</p>
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
import ElMessageBoxType from "@/domain/model/lang/ElmessageBoxType";
import "element-plus/dist/index.css";
import { Loading } from "@element-plus/icons-vue";
import { LoadingInstance } from "element-plus/es/components/loading/src/loading";
import { useLoadingStore } from "@/infrastructure/store/LoadingStore";
import { nextTick, onMounted } from "vue";

const router = useRouter();
const storeLoading = useLoadingStore();
let loadingInstance: LoadingInstance | null = null;

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

const showErrorMessageConfirmWithCallBack = async (
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

// onMounted(async () => {
//   console.log("mounted");
//   nextTick(() => {
//     showConfirm(
//       ElMessageBoxType.WARNING,
//       "削除確認",
//       "店舗の情報を削除してもよろしいですか？",
//       "削除する",
//       "キャンセル",
//       () => {
//         console.log("delete");
//       }
//     );
//   });
// });

const toOtherPage = async (pageName: string) => {
  showLoading(); // ローディング開始
  try {
    await router.push(`/${pageName}`);
  } catch (error) {
    console.error("Navigation error:", error);
  } finally {
    hideLoading(); // ローディング終了
  }
};
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
  height: calc(100vh - 120px);
  background-color: mediumseagreen;
  display: grid;
  justify-content: center;
  color: white;
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
