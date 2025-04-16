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
      <div class="buttonArea">
        <h3 v-html="t('post.subtitle_address')" />
        <v-btn
          @click="inputCurrentAddress"
          v-html="t('post.current_addres_input')"
        />
      </div>
      <v-autocomplete
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
      ></v-autocomplete>
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
import { useMapInfoStore } from "@/infrastructure/store/MapInfoStore";
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
const storeMapInfo = useMapInfoStore();
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
let map: google.maps.Map;

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

const inputCurrentAddress = async () => {
  emit("showLoading");
  try {
    const position: GeolocationPosition =
      await storeMapInfo.getCurrentLocation();
    const currentLatLng = new google.maps.LatLng(
      position.coords.latitude,
      position.coords.longitude
    );

    // Google Maps Geocoderのインスタンスを作成
    const geocoder = new google.maps.Geocoder();

    // 逆ジオコーディングのリクエストを実行
    geocoder.geocode({ location: currentLatLng }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results && results[0]) {
          let currentPrefecture = "";
          let currentCity = "";
          let currentStreet = "";

          // 住所コンポーネントをチェックして必要な情報を抽出
          let streetParts: string[] = []; // 番地を組み合わせるための配列
          let sublocalityParts: string[] = []; // 区名を格納する配列

          results[0].address_components.forEach((component) => {
            // 都道府県の取得
            if (component.types.includes("administrative_area_level_1")) {
              currentPrefecture = component.long_name;
            }

            // 市区町村の取得
            if (component.types.includes("locality")) {
              currentCity = component.long_name;
            }

            // 区名（sublocality_level_1）を取得
            if (component.types.includes("sublocality_level_1")) {
              sublocalityParts.push(component.long_name);
            }

            // streetの各部分を組み合わせ
            if (component.types.includes("sublocality_level_2")) {
              streetParts.push(component.long_name);
            }
            if (component.types.includes("sublocality_level_3")) {
              streetParts.push(component.long_name);
            }
            if (component.types.includes("sublocality_level_4")) {
              streetParts.push(component.long_name);
            }
            if (component.types.includes("premise")) {
              streetParts.push(component.long_name);
            }
          });

          // 市区町村名と区名を組み合わせ
          currentCity = `${currentCity}${sublocalityParts}`.trim();

          const streetPartsReverse = streetParts.reverse();
          for (let i = 0; i < streetPartsReverse.length; i++) {
            if (i === 3) currentStreet += "-";
            if (i === 4) currentStreet += " ";
            currentStreet += `${streetPartsReverse[i]}`;
          }
          // 全角数字を半角数字に変換
          currentStreet = currentStreet.replace(/[０-９]/g, (ch) =>
            String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
          );

          // 結果をVueのdataにセット
          cityName.value = currentCity;
          streetName.value = currentStreet;
          prefecture.value = currentPrefecture;
          emit("hideLoading");
        } else {
          console.log("住所が見つかりませんでした");
        }
      } else {
        console.log("ジオコーディングに失敗しました: " + status);
      }
    });
  } catch (error) {
    console.log("位置情報の取得に失敗しました: " + error);
    window.alert("位置情報の取得に失敗しました: " + error);
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
    .buttonArea {
      display: flex;
      position: relative;
      padding: 5px;
      .v-btn {
        position: absolute;
        right: 0;
        top: 0;
        background-color: lightgray;
        &:hover {
          opacity: 0.7;
        }
      }
    }
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
