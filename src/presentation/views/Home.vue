<template>
  <div id="home">
    <v-btn @click="getShopInfo" variant="outlined"> Button </v-btn>
    <div v-if="shopList.length > 0">
      <ul>
        <li v-for="(shop, index) in shopList" :key="index">
          <p>Shop ID: {{ shop.shop_id }}</p>
          <p>Shop Name: {{ shop.shop_name }}</p>
          <p>
            Location: {{ shop.location.coordinates[0] }},
            {{ shop.location.coordinates[1] }}
          </p>
        </li>
      </ul>
    </div>
    <!-- <div v-else>
      <p>No shops available</p>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import ShopListTransfer from "@/infrastructure/network/shop/ShopListTransfer.ts";
import { ref } from "vue";
import { Shop } from "../../infrastructure/network/shop/res/Shop";

const shopListTransfer = new ShopListTransfer();
const shopList = ref<Shop[]>([]);

const getShopInfo = async () => {
  const shopInfo = await shopListTransfer.getShopList();
  shopList.value = shopInfo;
};
</script>

<style lang="scss" scoped>
#home {
  padding: 20px;
}
v-btn {
  border: solid 1px;
  padding: 5px;
  &:hover {
    opacity: 0.5;
    cursor: pointer;
  }
}
</style>
