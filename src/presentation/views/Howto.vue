<template>
  <v-main id="howto">
    <v-container class="explain" pa-5>
      <v-row><img :src="search" alt="search" /> </v-row>
      <v-row
        ><span class="text">近くにあるブリトー屋さん を探してみよう</span>
      </v-row>
    </v-container>
    <v-container class="explain">
      <v-row><img :src="chart" alt="search" /> </v-row>
      <v-row
        ><span class="text"
          >ランキングで近所の人気のブリトー屋さんを調べよう</span
        >
      </v-row>
    </v-container>
    <v-container class="explain">
      <v-row><img :src="plus" alt="search" /> </v-row>
      <v-row><span class="text">新しいブリトー屋さんを登録しよう</span> </v-row>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import ShopListTransfer from "@/infrastructure/network/shop/ShopListTransfer.ts";
import { ref } from "vue";
import { Shop } from "../../infrastructure/network/shop/res/Shop";
import chart from "@/presentation/assets/chart.svg";
import search from "@/presentation/assets/search.svg";
import plus from "@/presentation/assets/plus.svg";

const shopListTransfer = new ShopListTransfer();
const shopList = ref<Shop[]>([]);

const getShopInfo = async () => {
  const shopInfo = await shopListTransfer.getShopList();
  console.log("shopInfo:", shopInfo);
  shopList.value = shopInfo;
};
</script>

<style lang="scss" scoped>
#howto {
  font-size: 1.5rem;
  display: inline-grid;
  height: 100%;
  @media (max-width: 400px) {
    font-size: 1rem;
  }
  .explain {
    display: grid;
  }
  img {
    padding: 10px;
    width: 5rem;
    height: 5rem;
    @media (max-width: 400px) {
      width: 3rem;
      height: 3rem;
    }
  }

  .text {
    word-break: keep-all;
  }
}
</style>
