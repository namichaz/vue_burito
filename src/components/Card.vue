<template>
  <v-card>
    <v-row id="iconArea">
      <v-col id="editIcon">
        <div class="icon edit" @click="clickEdit"></div>
      </v-col>
      <v-col id="deleteIcon">
        <div class="icon delete" @click="clickDelete"></div>
      </v-col>
    </v-row>
    <!-- shop_name を表示 -->
    <v-card-title>{{ shopName }}</v-card-title>
    <!-- prefecture, city, street を結合して表示 -->
    <v-card-subtitle>{{ address }}</v-card-subtitle>

    <!-- menu_list の内容を表示 -->
    <div id="menuArea">
      <v-row class="menuRow" justify="center" align="stretch">
        <v-col
          v-for="(menu, index) in availableMenus.slice(0, 3)"
          :key="index"
          :id="menu"
          :style="{ visibility: menuVisible(menu) ? 'visible' : 'hidden' }"
          class="menuItem"
        >
          {{ menu }}
        </v-col>
      </v-row>
      <v-row class="menuRow" justify="center" align="stretch">
        <v-col
          v-for="(menu, index) in availableMenus.slice(3, 6)"
          :key="index"
          :id="menu"
          :style="{ visibility: menuVisible(menu) ? 'visible' : 'hidden' }"
          class="menuItem"
        >
          {{ menu }}
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

// 親コンポーネントから渡された props
const props = defineProps({
  shopId: {
    type: Number,
    required: true,
  },
  shopName: {
    type: String,
    required: true,
  },
  prefecture: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  menuList: {
    type: Array,
    required: true,
  },
});

// `address` を結合した値として計算
const address = `${props.prefecture} ${props.city} ${props.street}`;

// メニューリスト
const availableMenus = [
  "tacos",
  "burrito",
  "tortilla",
  "nachos",
  "guacamole",
  "enchiladas",
];

// メニュー項目が表示すべきかどうかの判定
const menuVisible = (menu: string): boolean => {
  return props.menuList.includes(menu);
};

// 編集と削除ボタンのクリックイベント
const emit = defineEmits<{
  (e: "execDelete"): void;
  (e: "execEdit"): void;
}>();

const clickDelete = () => {
  emit("execDelete");
};
const clickEdit = () => {
  emit("execEdit");
};
</script>

<style lang="scss" scoped>
/* 同じスタイルはそのまま維持 */
.v-card {
  position: relative;
  width: 350px;
  max-width: 400px;
  border-radius: 20px;
  background-color: lightgray;
  color: white;
  height: 300px; /* 高さを調整 */
  margin: auto;
  transition: transform 0.5s ease;
  cursor: pointer;
  &:hover {
    transform: scale(1.1, 1.1);
  }
  @media (max-width: 400px) {
    max-width: 300px;
    font-size: 12px;
  }
  #iconArea {
    position: absolute;
    display: flex;
    justify-content: space-between;
    width: 100%;
    top: 15px;
    left: 10px;
    .icon {
      width: 30px;
      height: 30px;
      cursor: pointer;
      position: relative;
      &:hover {
        opacity: 0.5;
      }
    }
    .edit {
      background-image: url("@/presentation/assets/edit.svg");
    }
    .delete {
      background-image: url("@/presentation/assets/trash.svg");
      position: absolute;
      right: -5px;
    }
  }
  .v-card-title {
    font-size: 24px;
    padding-top: 40px;
    font-weight: bold;
  }
  .v-card-subtitle {
    font-size: 14px;
  }
  #menuArea {
    height: 40%;
    display: grid;
    padding: 20px;
    .menuRow {
      display: flex;
      justify-content: space-evenly; /* 均等に配置 */
      align-items: stretch; /* 高さを揃える */
      margin: 0;
      padding: 10px;
      column-gap: 10px;
      .v-col {
        border-radius: 40px;
        padding: 5px;
      }
      #tacos {
        background-color: #f4c58e;
      }
      #burrito {
        background-color: #f48eae;
      }
      #nachos {
        background-color: #b98ef4;
      }
      #enchiladas {
        background-color: #9faaab;
      }
      #guacamole {
        background-color: #8ef4b5;
      }
      #tortilla {
        background-color: #8ed1f4;
      }
    }
  }
}

.menuItem {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px; /* 高さを調整して、均等に配置 */
  background-color: lightgray;
  border-radius: 10px;
}
</style>
