export default class Shop {
  static shop_id: number;
  static shop_name: string;
  static latitude: number;
  static longitude: number;

  public static of(
    shop_id: number,
    shop_name: string,
    latitude: number,
    longitude: number
  ) {
    return new Shop(shop_id, shop_name, latitude, longitude);
  }

  public static empty() {
    return new Shop(0, "", 0, 0);
  }

  constructor(
    public readonly shop_id: number,
    public readonly shop_name: string,
    public readonly longitude: number,
    public readonly latitude: number
  ) {}
}
