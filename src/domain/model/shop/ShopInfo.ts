import Address from "@/domain/model/shop/Address";
import Shop from "@/domain/model/shop/Shop";
import MenuList from "@/domain/model/shop/MenuList";

export default class ShopInfo {
  public static of(shop: Shop, address: Address, menuList: string[]) {
    return new ShopInfo(shop, address, menuList);
  }

  public static empty() {
    return new ShopInfo(Shop.empty(), Address.empty(), MenuList.empty());
  }

  constructor(
    public readonly shop: Shop,
    public readonly address: Address,
    public readonly menuList: string[]
  ) {}
}
