<template>
  <header></header>
  <main>
    <router-view></router-view>
  </main>
  <footer>
    <nav>
      <ul>
        <li @click="toOtherPage('')">
          <img :src="home" alt="" />
        </li>
        <li @click="toOtherPage('search')">
          <img :src="search" alt="" />
        </li>
        <li>
          <img :src="chart" alt="" />
        </li>
        <li>
          <img :src="plus" alt="" />
        </li>
      </ul>
    </nav>
  </footer>
</template>

<script setup lang="ts">
import chart from "@/assets/chart.png";
import home from "@/assets/home.png";
import search from "@/assets/search.png";
import plus from "@/assets/plus.png";
import { useRouter } from "vue-router";

const router = useRouter();

const toOtherPage = (pageName: string) => {
  router.push(`/${pageName}`);
};
</script>
<style lang="scss" scope>
footer {
  width: 100%;
  ul {
    display: flex;
    list-style: none;
    padding: 0;
    column-gap: 3rem;
    li {
      &:hover {
        opacity: 0.5;
        cursor: pointer;
      }
    }
  }
}
</style>
