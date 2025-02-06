export default class Shop {
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
