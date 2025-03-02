<template>
  <div id="howto">
    <div class="pa-12">
      <h1 v-html="t('howto.page_title')" />
      <p class="text" v-html="t('howto.description')" />
    </div>
    <div class="explain">
      <div class="icon"><img :src="search" alt="search" /></div>
      <h2 v-html="t('howto.first_step')" />
      <p class="text" v-html="t('howto.first_step_description')" />
    </div>
    <div class="explain">
      <div class="icon"><img :src="chart" alt="search" /></div>
      <h2 v-html="t('howto.second_step')" />
      <p class="text" v-html="t('howto.second_step_description')" />
    </div>
    <div class="explain">
      <div class="icon"><img :src="plus" alt="search" /></div>
      <h2 v-html="t('howto.third_step')" />
      <p class="text" v-html="t('howto.third_step_description')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import chart from "@/presentation/assets/chart.svg";
import search from "@/presentation/assets/search.svg";
import plus from "@/presentation/assets/plus.svg";
import { useShopInfoStore } from "@/infrastructure/store/ShopInfoStore";
import { useI18n } from "vue-i18n";

const storeShopInfo = useShopInfoStore();
const { t } = useI18n();

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
