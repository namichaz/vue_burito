<template>
  <div id="howto">
    <div class="pa-12">
      <h1>How to</h1>
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
        まずは、ページ下部の「Search」ボタンから、スポットを検索・閲覧してみましょう。
        スポットの検索方法は、「現在地から検索」と「住所・スポット名から検索」の二種類。リスト表示にすると、現在投稿されているすべてのスポットの情報を閲覧することができます。
      </p>
    </div>
    <div class="explain">
      <div class="icon"><img :src="chart" alt="search" /></div>
      <h2>2. 人気のお店を調べよう</h2>
      <p class="text">
        ページ下部の「Rank」ボタンから、いいねの数が多いお店を見てみましょう。
      </p>
    </div>
    <div class="explain">
      <div class="icon"><img :src="plus" alt="search" /></div>
      <h2>3. 新しいお店を登録しよう</h2>
      <p class="text">
        ページ下部の「Post」ボタンから、新しく見つけたお店を登録してみましょう。
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import ShopListTransfer from "@/infrastructure/network/shop/ShopListTransfer";
import { onMounted, ref } from "vue";
import { Shop } from "@/infrastructure/network/shop/res/Shop";
import chart from "@/presentation/assets/chart.svg";
import search from "@/presentation/assets/search.svg";
import plus from "@/presentation/assets/plus.svg";
import { useShopInfoStore } from "@/infrastructure/store/ShopInfoStore";

const storeShopInfo = useShopInfoStore();
const shopListTransfer = new ShopListTransfer();
const shopList = ref<Shop[]>([]);

const getShopInfo = async () => {
  const shopInfo = await shopListTransfer.getShopList();
  console.log("shopInfo:", shopInfo);
  // shopList.value = shopInfo;
};

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
