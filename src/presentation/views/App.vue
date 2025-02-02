<template>
  <header>
    <!-- <div>
      <span>Where is my best burito!!</span>
    </div> -->
    <div class="loop-wrap">
      <ul class="loop-area">
        <li class="content">Where is my best burrito!?</li>
        <li class="content">Where is my best burrito!?</li>
        <li class="content">Where is my best burrito!?</li>
        <li class="content">Where is my best burrito!?</li>
      </ul>
      <ul class="loop-area">
        <li class="content">Where is my best burrito!?</li>
        <li class="content">Where is my best burrito!?</li>
        <li class="content">Where is my best burrito!?</li>
        <li class="content">Where is my best burrito!?</li>
      </ul>
      <ul class="loop-area">
        <li class="content">Where is my best burrito!?</li>
        <li class="content">Where is my best burrito!?</li>
        <li class="content">Where is my best burrito!?</li>
        <li class="content">Where is my best burrito!?</li>
      </ul>
    </div>
  </header>
  <main>
    <router-view></router-view>
  </main>
  <footer>
    <nav>
      <ul>
        <li @click="toOtherPage('')">
          <img :src="home" alt="" />
          <p>Home</p>
        </li>
        <li @click="toOtherPage('search')">
          <img :src="search" alt="" />
          <p>Search</p>
        </li>
        <li>
          <img :src="chart" alt="" />
          <p>Rank</p>
        </li>
        <li>
          <img :src="plus" alt="" />
          <p>Post</p>
        </li>
      </ul>
    </nav>
  </footer>
</template>

<script setup lang="ts">
import chart from "@/presentation/assets/chart.png";
import home from "@/presentation/assets/home.png";
import search from "@/presentation/assets/search.png";
import plus from "@/presentation/assets/plus.png";
import { useRouter } from "vue-router";

const router = useRouter();

const toOtherPage = (pageName: string) => {
  router.push(`/${pageName}`);
};
</script>
<style lang="scss" scope>
header {
  height: 60px;
  background-color: #773a00;
  font-size: 30px;
  color: black;
}
.loop-wrap {
  display: flex;
  align-items: center;
  overflow: hidden;
  height: 50px;
}
.loop-area {
  display: flex;
  animation: loop-slide 30s infinite linear 1s both;
  list-style: none;
  margin: 0;
  padding: 0;
}
.loop-area .content {
  width: 500px;
}
@keyframes loop-slide {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}
main {
  height: calc(100vh - 120px);
  background-color: #569cdb;
}
footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: #773a00;
  color: black;
  nav {
    padding: 6px;
  }
  ul {
    display: inline-flex;
    list-style: none;
    column-gap: 3rem;
    li {
      padding-top: 4px;
      &:hover {
        opacity: 0.5;
        cursor: pointer;
      }
    }
    img {
      height: 25px;
      width: 25px;
    }
  }
}
</style>
