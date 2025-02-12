<template>
  <div id="post">
    <h1>{{ storeShopInfo.isPost() ? "Post" : "Edit" }}</h1>
    <div class="inputArea">
      <h3>Shop Name</h3>
      <input type="text" placeholder="お店の名前" v-model="shopName" />
    </div>
    <div class="inputArea">
      <h3>Adress</h3>
      <v-select
        v-model="prefacture"
        label="都道府県"
        :items="prefectures"
        variant="solo-filled"
        density="compact"
        bg-color="lightgray"
      ></v-select>
      <input type="text" placeholder="市区町村" v-model="cityName" />
      <input type="text" placeholder="番地" v-model="streetName" />
    </div>
    <div class="checkBoxArea">
      <h3>Menu</h3>
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
    <div class="btnArea">
      <p v-if="isError" style="color: red; padding: 10px">{{ errMessage }}</p>
      <v-btn class="initButton" variant="elevated" @click="onSubmit">
        {{ storeShopInfo.isPost() ? "登録" : "更新" }}
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { getMenuItems, MenuItem } from "@/domain/model/shop/MenuItem";
import { useShopInfoStore } from "@/infrastructure/store/ShopInfoStore";
import { Loader } from "@googlemaps/js-api-loader";
import Shop from "@/domain/model/shop/Shop";
import ShopInfo from "@/domain/model/shop/ShopInfo";
import Address from "@/domain/model/shop/Address";

const apiKey = import.meta.env.VITE_GMAP_APIKEY;
const address = ref("");
const latitude = ref(0);
const longitude = ref(0);
let location = { latitude: 0, longitude: 0 };
const storeShopInfo = useShopInfoStore();
const shopInfo = ref(ShopInfo.empty());
const shopName = ref(
  storeShopInfo.isPost() ? "" : storeShopInfo.getShopInfo().shop.shop_name
);
const prefacture = ref(
  storeShopInfo.isPost() ? "" : storeShopInfo.getShopInfo().address.prefacture
);
const cityName = ref(
  storeShopInfo.isPost() ? "" : storeShopInfo.getShopInfo().address.city
);
const streetName = ref(
  storeShopInfo.isPost() ? "" : storeShopInfo.getShopInfo().address.street
);
const checkBoxValue = ref(
  storeShopInfo.isPost() ? [] : storeShopInfo.getShopInfo().menuItem
);

const errMessage = ref("");
const isError = ref(false);
const menuItems = getMenuItems();

const prefectures = [
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

const loader = new Loader({
  apiKey,
  version: "weekly",
  libraries: ["places"],
});

const inputValidate = () => {
  errMessage.value = "";
  if (checkBoxValue.value.length === 0)
    errMessage.value = "Menuは最低1つ選択してください。";
  if (streetName.value === "") errMessage.value = "番地を入力してください。";
  if (cityName.value === "") errMessage.value = "市区町村を入力してください。";
  if (prefacture.value === "")
    errMessage.value = "都道府県を入力してください。";
  if (shopName.value === "")
    errMessage.value = "お店の名前を入力してください。";
  if (errMessage.value !== "") return (isError.value = true);
};

const getCoordinates = async () => {
  // addressを組み立てる
  address.value = `${prefacture.value}${cityName.value}${streetName.value}`;
  console.log("address.value:", address.value);

  if (!address.value) {
    errMessage.value = "住所を入力してください";
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
          reject(new Error("住所が正しくありません"));
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
    errMessage.value = error.message || "エラーが発生しました";
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

const onSubmit = async () => {
  console.log(checkBoxValue.value);
  if (inputValidate()) return;
  await getCoordinates();

  shopInfo.value = ShopInfo.of(
    Shop.of(0, shopName.value, location.latitude, location.longitude),
    Address.of(prefacture.value, cityName.value, streetName.value),
    checkBoxValue.value
  );
  console.log("shopInfo:", shopInfo.value);
  return;
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
    button {
      background-color: lightgray;
      width: 200px;
      border-radius: 30px;
      color: white;
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
