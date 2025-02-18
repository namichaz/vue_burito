import Address from "@/domain/model/shop/Address";
import Shop from "@/domain/model/shop/Shop";
import ShopInfo from "@/domain/model/shop/ShopInfo";
import MenuList from "@/domain/model/shop/MenuList";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useShopInfoStore = defineStore(
  "shopInfo",
  () => {
    const shop = ref(Shop.empty());
    const address = ref(Address.empty());
    const menuList = ref<string[]>([]);
    const shopInfo = ref(
      ShopInfo.of(shop.value, address.value, menuList.value)
    );
    const isPostValue = ref(false);
    const shopInfos = ref<ShopInfo[]>([]);
    const forEditShopInfo = ref<ShopInfo>(ShopInfo.empty());
    const latitude = ref(0);
    const longitude = ref(0);
    const searchQuery = ref<string>("");
    const isList = ref(false);
    const shopName = ref("");

    const isPost = () => {
      return isPostValue.value;
    };

    const isFromList = () => {
      return isList.value;
    };

    const getShopInfo = () => {
      return shopInfo.value;
    };

    const getShopInfos = () => {
      return shopInfos.value;
    };

    const getEditShopInfo = () => {
      return forEditShopInfo.value;
    };

    const getShop = () => {
      return shop.value;
    };

    const getAddress = () => {
      return address.value;
    };

    const getMenuList = () => {
      return menuList.value;
    };

    const getLatitude = () => {
      return latitude.value;
    };

    const getLongitude = () => {
      return longitude.value;
    };

    const getShopName = () => {
      return shopName.value;
    };

    const setShop = (shopValue: Shop) => {
      shop.value = shopValue;
    };

    const setShopName = (shopNameValue: string) => {
      shopName.value = shopNameValue;
    };

    const setAddress = (addressValue: Address) => {
      address.value = addressValue;
    };

    const setLatitude = (latitudeValue: number) => {
      latitude.value = latitudeValue;
    };

    const setLongitude = (longitudeValue: number) => {
      longitude.value = longitudeValue;
    };

    const setMenu = (menuItems: string[]) => {
      menuList.value = menuItems;
    };

    const setShopInfos = (shops: ShopInfo[]) => {
      shopInfos.value = shops;
    };

    const setEditShopInfo = (shopInfo: ShopInfo) => {
      forEditShopInfo.value = shopInfo;
    };

    return {
      isPostValue,
      isList,
      isPost,
      isFromList,
      getShopInfo,
      getShopInfos,
      getEditShopInfo,
      getShop,
      getShopName,
      getAddress,
      getMenuList,
      getLatitude,
      getLongitude,
      setMenu,
      setShop,
      setShopName,
      setAddress,
      setShopInfos,
      setEditShopInfo,
      setLatitude,
      setLongitude,
    };
  },
  {
    persist: true,
  }
);
