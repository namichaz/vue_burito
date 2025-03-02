<template>
  <div id="post">
    <h1 v-html="t('list.page_title')" />
    <div id="cardArea" v-if="isShowList()">
      <Card
        v-for="(shopInfo, index) in shopInfos"
        :key="index"
        :shopId="shopInfo.shop.shop_id"
        :shopName="shopInfo.shop.shop_name"
        :prefecture="shopInfo.address.prefecture"
        :city="shopInfo.address.city"
        :street="shopInfo.address.street"
        :latitude="shopInfo.address.latitude"
        :longitude="shopInfo.address.longitude"
        :menuList="shopInfo.menuList"
        @execDelete="execDelete"
        @execEdit="execEdit"
        @navigateToMap="navigateToMap"
      />
    </div>
    <span v-else>表示するリストがありません</span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import Card from "@/components/Card.vue";
import ElMessageBoxType from "@/domain/model/lang/ElMessageBoxType";
import { useShopInfoStore } from "@/infrastructure/store/ShopInfoStore";
import ShopDeleteTransfer from "@/infrastructure/network/shop/ShopDeleteTransfer";
import ShopListTransfer from "@/infrastructure/network/shop/ShopListTransfer";
import ShopInfo from "@/domain/model/shop/ShopInfo";
import router from "@/router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const storeShopInfo = useShopInfoStore();
const shopDeleteTransfer = new ShopDeleteTransfer();
const shopListTransfer = new ShopListTransfer();
const shopList = ref([ShopInfo.empty()]);

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

// 店舗リストのサンプルデータ
const shopInfos = ref(storeShopInfo.getShopInfos());

const isShowList = () => {
  return shopInfos.value.length > 0;
};

const getShopList = async () => {
  try {
    shopList.value = await shopListTransfer.getShopList();
    if (shopList.value.length === 0) return;
    storeShopInfo.setShopInfos(shopList.value);
  } catch (error) {
    console.error("店舗情報の取得エラー:", error);
  } finally {
    shopInfos.value = storeShopInfo.getShopInfos();
  }
};

const returnHome = () => {
  router.push({ name: "howto" });
};

const execDelete = (shopId: number, shop_name: string) => {
  console.log("shopId:", shopId);
  emit(
    "showConfirm",
    ElMessageBoxType.WARNING,
    t("list.confirm_delete").toString(),
    t("list.confirm_delete_description", {
      shopName: shop_name,
    }).toString(),
    t("list.delete").toString(),
    t("list.cancel").toString(),
    async () => {
      await deleteShopCard(shopId, shop_name);
    }
  );
};

const deleteShopCard = async (shopId: number, shop_name: string) => {
  try {
    emit("showLoading");
    await shopDeleteTransfer.deleteShop(shopId);
    emit(
      "showMessageBox2",
      ElMessageBoxType.INFO,
      t("list.delete_success").toString(),
      t("list.delete_success_description", { shopName: shop_name }).toString(),
      "OK",
      async () => {
        window.location.reload();
      }
    );
  } catch (e) {
    emit(
      "showErrorMessageWithCallBack",
      ElMessageBoxType.ERROR,
      t("list.delete_faild").toString(),
      t("list.delete_faild_description", { error: e }).toString(),
      returnHome
    );
  } finally {
    emit("hideLoading");
  }
};

const execEdit = (shopInfo: ShopInfo) => {
  storeShopInfo.isPostValue = false;
  emit(
    "showConfirm",
    ElMessageBoxType.INFO,
    t("list.confirm_edit").toString(),
    t("list.confirm_edit_description", {
      shopName: shopInfo.shop.shop_name,
    }).toString(),
    t("list.edit").toString(),
    t("list.cancel"),
    () => {
      storeShopInfo.setEditShopInfo(shopInfo);
      emit("toOtherPage", "post");
    }
  );
};

const navigateToMap = (
  latitude: number,
  longitude: number,
  shopName: string
) => {
  storeShopInfo.setLatitude(longitude);
  storeShopInfo.setLongitude(latitude);
  storeShopInfo.setShopName(shopName);
  storeShopInfo.isList = true;
  router.push({ name: "search" });
};

onMounted(() => {
  storeShopInfo.isPostValue = true;
  getShopList();
});
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
  #cardArea {
    gap: 40px;
    display: grid;
  }
}
</style>
