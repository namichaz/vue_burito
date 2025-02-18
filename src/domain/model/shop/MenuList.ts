import { MenuItem } from "@/domain/model/shop/MenuItem";

export default class MenuList {
  constructor(public readonly menuList: string[]) {}
  public static of(items: string[]) {
    return items;
  }

  public static empty() {
    return new Array("");
  }
}
