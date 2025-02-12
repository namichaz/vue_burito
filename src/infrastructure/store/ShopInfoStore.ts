import Address from "@/domain/model/shop/Address";
import { MenuItem } from "@/domain/model/shop/MenuItem";
import Shop from "@/domain/model/shop/Shop";
import ShopInfo from "@/domain/model/shop/ShopInfo";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useShopInfoStore = defineStore(
  "shopInfo",
  () => {
    const shop = ref(Shop.empty());
    const address = ref(Address.empty());
    const menuItem = ref([]);
    const shopInfo = ref(
      ShopInfo.of(shop.value, address.value, menuItem.value)
    );
    const isPostValue = ref(false);

    const isPost = () => {
      return isPostValue.value;
    };

    const getShopInfo = () => {
      return shopInfo.value;
    };

    const getShop = () => {
      return shop.value;
    };

    const getAddress = () => {
      return address.value;
    };

    const getMenuItem = () => {
      return menuItem.value;
    };

    const setShopInfo = (
      shop: Shop,
      address: Address,
      menuItem: MenuItem[]
    ) => {
      return (shopInfo.value = ShopInfo.of(shop, address, menuItem));
    };

    return {
      isPostValue,
      isPost,
      getShopInfo,
      getShop,
      getAddress,
      getMenuItem,
      setShopInfo,
    };
  },
  {
    persist: true,
  }
);
