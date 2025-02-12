<template>
  <div id="post">
    <h1>Shop List</h1>
    <div id="cardArea">
      <Card
        v-for="(shop, index) in shopList"
        :key="index"
        :shopId="shop.shop_id"
        :shopName="shop.shop_name"
        :prefecture="shop.prefecture"
        :city="shop.city"
        :street="shop.street"
        :menuList="shop.menu_list.split(',')"
        @execDelete="execDelete(storeShopInfo.getShop().shop_id)"
        @execEdit="execEdit(storeShopInfo.getShop().shop_id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import Card from "@/components/Card.vue";
import ElMessageBoxType from "@/domain/model/lang/ElmessageBoxType";
import { useShopInfoStore } from "@/infrastructure/store/ShopInfoStore";

const storeShopInfo = useShopInfoStore();
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
  (e: "toOtherPage", pageName: string): void;
}>();

// 店舗リストのサンプルデータ
const shopList = ref([
  {
    shop_id: 1,
    shop_name: "Elsocalo Burrito",
    prefecture: "大阪府",
    city: "大阪市北区",
    street: "豊崎３丁目１９−３",
    menu_list: "nachos,tacos,guacamole",
  },
  {
    shop_id: 2,
    shop_name: "Taco Palace",
    prefecture: "東京都",
    city: "新宿区",
    street: "西新宿２丁目８−１",
    menu_list: "burrito,tacos,salsa",
  },
  {
    shop_id: 3,
    shop_name: "Ola Tacos Bar",
    prefecture: "大阪府",
    city: "大阪市浪速区",
    street: "浪速２丁目８−１",
    menu_list: "tacos,burrito,tortilla,nachos,guacamole,enchiladas",
  },
]);

const execDelete = async (shopId: number) => {
  emit(
    "showConfirm",
    ElMessageBoxType.WARNING,
    "削除確認",
    `${EventTarget.name}の情報を削除してもよろしいですか？`,
    "削除する",
    "キャンセル",
    () => {
      console.log("delelte");
    }
  );
};

const execEdit = (shopId: number) => {
  storeShopInfo.isPostValue = false;
  console.log("isPost", storeShopInfo.isPost());
  emit("toOtherPage", "post");
};

onMounted(() => {
  storeShopInfo.isPostValue = true;
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
