<template>
  <div id="post">
    <h1>
      {{
        isPost ? t("post.page_title_add").toString() : t("post.page_title_edit")
      }}
    </h1>
    <div class="inputArea">
      <h3 v-html="t('post.subtitle_shopName')" />
      <input
        type="text"
        :placeholder="t('post.subtitle_shopName')"
        v-model="shopName"
      />
    </div>
    <div class="inputArea">
      <h3 v-html="t('post.subtitle_address')" />
      <v-select
        v-model="prefecture"
        :label="t('post.prefecture')"
        :items="
          storeLanguage.language() == ELanguageType.JAJP
            ? prefectures_ja
            : prefectures_en
        "
        variant="solo-filled"
        density="compact"
        bg-color="lightgray"
      ></v-select>
      <input type="text" :placeholder="t('post.city')" v-model="cityName" />
      <input type="text" :placeholder="t('post.street')" v-model="streetName" />
    </div>
    <div class="checkBoxArea">
      <h3 v-html="t('post.subtitle_menu')" />
      <v-row no-gutters>
        <v-col cols="6" v-for="item in menuItems" :key="item.value">
          <div class="checkbox-item">
            <input
              type="checkbox"
              v-model="checkBoxValue"
              :id="item.value"
              :value="item.value"
            />
            <label :for="item.value">{{ item.label }}</label>
          </div>
        </v-col>
      </v-row>
    </div>
    <p v-if="isError" style="color: red; padding: 10px">{{ errMessage }}</p>
    <div class="btnArea" :class="{ editBtnArea: !isPost }">
      <v-btn
        v-if="!isPost"
        :class="{ editBtn: !isPost }"
        variant="elevated"
        @click="returnList"
        v-html="t('post.return')"
      />
      <v-btn
        class="initButton"
        :class="{ editBtn: !isPost }"
        variant="elevated"
        @click="onSubmit"
      >
        {{
          isPost ? t("post.register").toString() : t("post.update").toString()
        }}
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { getMenuItems, MenuItem } from "@/domain/model/shop/MenuItem";
import { useShopInfoStore } from "@/infrastructure/store/ShopInfoStore";
import { useLanguageStore } from "@/infrastructure/store/LanguageStore";
import { Loader } from "@googlemaps/js-api-loader";
import Shop from "@/domain/model/shop/Shop";
import ShopInfo from "@/domain/model/shop/ShopInfo";
import Address from "@/domain/model/shop/Address";
import ShopRegisterTransfer from "@/infrastructure/network/shop/ShopRegisterTransfer";
import ElMessageBoxType from "@/domain/model/lang/ElMessageBoxType";
import router from "@/router";
import ShopDeleteTransfer from "@/infrastructure/network/shop/ShopDeleteTransfer";
import { useI18n } from "vue-i18n";
import ELanguageType from "@/domain/model/lang/ELanguageType";

const { t } = useI18n();
const apiKey = import.meta.env.VITE_GMAP_APIKEY;
const address = ref("");
const latitude = ref(0);
const longitude = ref(0);
let location = { latitude: 0, longitude: 0 };
const storeShopInfo = useShopInfoStore();
const storeLanguage = useLanguageStore();
const isPost = computed(() => storeShopInfo.isPost());
const shopInfo = ref(ShopInfo.empty());
const shopId = ref(
  isPost.value ? 0 : storeShopInfo.getEditShopInfo().shop.shop_id
);
const shopName = ref(
  isPost.value ? "" : storeShopInfo.getEditShopInfo().shop.shop_name
);
const prefecture = ref(
  isPost.value ? "" : storeShopInfo.getEditShopInfo().address.prefecture
);
const cityName = ref(
  isPost.value ? "" : storeShopInfo.getEditShopInfo().address.city
);
const streetName = ref(
  isPost.value ? "" : storeShopInfo.getEditShopInfo().address.street
);
const checkBoxValue = ref(
  isPost.value
    ? []
    : Object.values(storeShopInfo.getEditShopInfo().menuList).flat()
);
const errMessage = ref("");
const isError = ref(false);
const menuItems = getMenuItems();
const shopRegisterTransfer = new ShopRegisterTransfer();
const shopDeleteTransfer = new ShopDeleteTransfer();

const prefectures_ja = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
];

const prefectures_en = [
  "Hokkaido",
  "Aomori",
  "Iwate",
  "Miyagi",
  "Akita",
  "Yamagata",
  "Fukushima",
  "Ibaraki",
  "Tochigi",
  "Gunma",
  "Saitama",
  "Chiba",
  "Tokyo",
  "Kanagawa",
  "Niigata",
  "Toyama",
  "Ishikawa",
  "Fukui",
  "Yamanashi",
  "Nagano",
  "Gifu",
  "Shizuoka",
  "Aichi",
  "Mie",
  "Shiga",
  "Kyoto",
  "Osaka",
  "Hyogo",
  "Nara",
  "Wakayama",
  "Tottori",
  "Shimane",
  "Okayama",
  "Hiroshima",
  "Yamaguchi",
  "Tokushima",
  "Kagawa",
  "Ehime",
  "Kochi",
  "Fukuoka",
  "Saga",
  "Nagasaki",
  "Kumamoto",
  "Oita",
  "Miyazaki",
  "Kagoshima",
  "Okinawa",
];

const emit = defineEmits<{
  (
    e: "showConfirm",
    type: ElMessageBoxType,
    title: string,
    message: string,
    confirmLabel: string,
    cancelLabel: string,
    callback: () => void
  ): void;
  (
    e: "showMessageBox",
    type: ElMessageBoxType,
    title: string,
    message: string
  ): void;
  (
    e: "showMessageBox2",
    type: ElMessageBoxType,
    title: string,
    message: string,
    confirmLabel: string,
    callback: () => void
  ): void;
  (
    e: "showErrorMessageWithCallBack",
    type: ElMessageBoxType,
    title: string,
    message: string,
    callback: () => void
  ): void;
  (e: "toOtherPage", pageName: string): void;
  (e: "showLoading"): void;
  (e: "hideLoading"): void;
}>();

const loader = new Loader({
  apiKey,
  version: "weekly",
  libraries: ["places"],
});

const inputValidate = () => {
  errMessage.value = "";
  if (checkBoxValue.value.length === 0)
    errMessage.value = t("post.error_message.not_selected_menu").toString();
  if (streetName.value === "")
    errMessage.value = t("post.error_message.not_entered_street").toString();
  if (cityName.value === "")
    errMessage.value = t("post.error_message.not_entered_city").toString();
  if (prefecture.value === "")
    errMessage.value = t(
      "post.error_message.not_entered_prefecture"
    ).toString();
  if (shopName.value === "")
    errMessage.value = t("post.error_message.not_entered_shopName").toString();
  if (errMessage.value !== "") return (isError.value = true);
};

const getCoordinates = async () => {
  // addressを組み立てる
  address.value = `${prefecture.value}${cityName.value}${streetName.value}`;

  if (!address.value) {
    errMessage.value = t("post.error_message.not_entered_address").toString();
    latitude.value = 0;
    longitude.value = 0;
    return;
  }

  try {
    // Google Maps APIを読み込む
    const google = await loader.load();
    const geocoder = new google.maps.Geocoder();

    // Geocodingリクエストを送信
    const results = await new Promise<any[]>((resolve, reject) => {
      geocoder.geocode({ address: address.value }, (results, status) => {
        if (status === "OK") {
          resolve(results!);
        } else {
          reject(
            new Error(t("post.error_message.not_correct_address").toString())
          );
        }
      });
    });

    // 結果を処理
    latitude.value = results[0].geometry.location.lat();
    longitude.value = results[0].geometry.location.lng();
    errMessage.value = "";
    isError.value = false;
  } catch (error: any) {
    console.error(error);
    errMessage.value =
      error.message || t("post.error_message.errro_occurred").toString();
    latitude.value = 0;
    longitude.value = 0;
    isError.value = true;
  } finally {
    location = {
      latitude: latitude.value,
      longitude: longitude.value,
    };
  }
};

const returnHome = () => {
  router.push({ name: "howto" });
};

const returnList = () => {
  router.push({ name: "list" });
};

const onSubmit = async () => {
  console.log(checkBoxValue.value);
  if (inputValidate()) return;

  emit("showLoading");
  await getCoordinates();

  shopInfo.value = ShopInfo.of(
    Shop.of(shopId.value, shopName.value),
    Address.of(
      prefecture.value,
      cityName.value,
      streetName.value,
      location.latitude,
      location.longitude
    ),
    checkBoxValue.value
  );
  try {
    if (!isPost.value) await shopDeleteTransfer.deleteShop(shopId.value);
    await shopRegisterTransfer.registerShop(shopInfo.value);

    emit(
      "showMessageBox2",
      ElMessageBoxType.INFO,
      isPost.value
        ? t("post.register_success").toString()
        : t("post.update_success").toString(),
      isPost.value
        ? t("post.register_shopName", { shopName: shopName.value }).toString()
        : t("post.update_shopInfo").toString(),
      "OK",
      async () => {
        window.location.reload();
      }
    );
    returnList();
  } catch (error) {
    emit(
      "showErrorMessageWithCallBack",
      ElMessageBoxType.ERROR,
      isPost.value
        ? t("post.register_faild").toString()
        : t("post.update_faild").toString(),
      isPost.value
        ? t("post.register_faild_description", { error: error }).toString()
        : t("post.update_faild_description", { error: error }).toString(),
      returnHome
    );
  } finally {
    emit("hideLoading");
  }
};
</script>

<style lang="scss" scoped>
#post {
  max-width: 500px;
  width: 500px;
  height: auto;
  padding: 10px;
  @media (max-width: 400px) {
    width: auto;
  }
  h1 {
    padding: 2rem;
  }
  .inputArea {
    gap: 20px;
    padding: 30px;
    display: grid;
    max-width: 400px;
    input {
      background-color: lightgray;
      width: 400px;
      height: 40px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      @media (max-width: 400px) {
        width: 300px;
      }
    }
  }
  .checkBoxArea {
    gap: 10px;
    padding: 30px;
    display: grid;
    .checkbox-item {
      display: flex;
      align-items: center;
      input {
        background-color: lightgray;
        width: 30px;
        height: 25px;
        border: 1px solid #ccc;
        position: relative;
        top: 4px;
        margin-right: 4px;
        accent-color: lightgray;
      }
      label {
        margin-left: 8px; /* ここでチェックボックスとラベルの間隔を調整 */
      }
    }
    .v-row {
      row-gap: 15px;
    }
  }
  .btnArea {
    gap: 10px;
    padding: 30px;
    margin: auto;
    button {
      background-color: lightgray;
      width: 200px;
      border-radius: 30px;
      color: white;
    }
  }
  .editBtnArea {
    display: flex;
    max-width: 400px;
    margin: auto;
    .editBtn {
      width: 48%;
    }
  }
  h3 {
    display: flex;
  }
  :deep(.v-field) {
    background-color: lightgray;
    .v-icon {
      background-image: url("@/presentation/assets/arrow.svg");
    }
  }
  :deep(.v-input__details) {
    display: none;
  }
}
</style>
