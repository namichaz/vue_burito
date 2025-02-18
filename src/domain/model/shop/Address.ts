export default class Address {
  public static of(
    prefecture: string,
    city: string,
    street: string,
    latitude: number,
    longitude: number
  ) {
    return new Address(prefecture, city, street, latitude, longitude);
  }

  public static empty() {
    return new Address("", "", "", 0, 0);
  }

  constructor(
    public readonly prefecture: string,
    public readonly city: string,
    public readonly street: string,
    public readonly longitude: number,
    public readonly latitude: number
  ) {}
}
