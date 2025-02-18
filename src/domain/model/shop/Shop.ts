export default class Shop {
  static shop_id: number;
  static shop_name: string;

  public static of(shop_id: number, shop_name: string) {
    return new Shop(shop_id, shop_name);
  }

  public static empty() {
    return new Shop(0, "");
  }

  constructor(
    public readonly shop_id: number,
    public readonly shop_name: string
  ) {}
}
