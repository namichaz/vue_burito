import Address from "@/domain/model/shop/Address";
import Shop from "@/domain/model/shop/Shop";
import { MenuItem } from "@/domain/model/shop/MenuItem";

export default class ShopInfo {
  public static of(shop: Shop, address: Address, menuItem: MenuItem[]) {
    return new ShopInfo(shop, address, menuItem);
  }

  public static empty() {
    return new ShopInfo(Shop.empty(), Address.empty(), []);
  }

  constructor(
    public readonly shop: Shop,
    public readonly address: Address,
    public readonly menuItem: MenuItem[]
  ) {}
}
