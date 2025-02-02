export default class Shop {
  public static of(
    shop_id: number,
    shop_name: string,
    location: {
      type: "Point";
      coordinates: [number, number];
    }
  ) {
    return new Shop(shop_id, shop_name, location);
  }

  public static empty() {
    return new Shop(0, "", { type: "Point", coordinates: [0, 0] });
  }

  constructor(
    public readonly shop_id: number,
    public readonly shop_name: string,
    public readonly location: {
      type: "Point";
      coordinates: [number, number];
    }
  ) {}
}
