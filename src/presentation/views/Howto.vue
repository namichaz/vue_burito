<template>
  <div id="howto">
    <div class="pa-12">
      <h1>How To</h1>
      <p class="text">
        Where's my best
        burrito!?はあなただけの最高のブリトーを見つける為のサービスです！
        美味しいブリトー屋さんを発見したら地図に登録してみんなにシェアしましょう！
      </p>
    </div>
    <div class="explain">
      <div class="icon"><img :src="search" alt="search" /></div>
      <h2>1. お店を検索してみよう</h2>
      <p class="text">
        まずは、ページ下部の「Search」ボタンから、お店を検索・閲覧してみましょう。
        お店の検索方法は、「現在地から検索」と「住所・地名などから検索」の二種類。
      </p>
    </div>
    <div class="explain">
      <div class="icon"><img :src="chart" alt="search" /></div>
      <h2>2. 一覧でお店を調べよう</h2>
      <p class="text">
        ページ下部の「List」ボタンから、現在登録されているすべてのお店の情報を閲覧することができます。また、そのお店が提供してるフードサービスが確認できます。
      </p>
    </div>
    <div class="explain">
      <div class="icon"><img :src="plus" alt="search" /></div>
      <h2>3. 新しいお店を登録しよう</h2>
      <p class="text">
        ページ下部の「Add」ボタンから、新しく見つけたお店を登録してみましょう。
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Shop } from "@/infrastructure/network/shop/res/Shop";
import chart from "@/presentation/assets/chart.svg";
import search from "@/presentation/assets/search.svg";
import plus from "@/presentation/assets/plus.svg";
import { useShopInfoStore } from "@/infrastructure/store/ShopInfoStore";

const storeShopInfo = useShopInfoStore();

onMounted(() => {
  storeShopInfo.isPostValue = true;
});
</script>

<style lang="scss" scoped>
#howto {
  max-width: 500px;
}
.explain {
  display: grid;
  padding: 64px;
  @media (max-width: 400px) {
    padding: 20px;
  }
}
.icon {
  padding: 10px 0;
}
img {
  padding: 10px;
  width: 5rem;
  height: 5rem;
  @media (max-width: 400px) {
    width: 5rem;
    height: 5rem;
  }
}
.text {
  word-break: break-word;
  font-size: 1rem;
  padding: 20px 0;
  line-height: 1.5rem;
  text-align: left;
}
</style>
