export default class Address {
  public static of(prefacture: string, city: string, street: string) {
    return new Address(prefacture, city, street);
  }

  public static empty() {
    return new Address("", "", "");
  }

  constructor(
    public readonly prefacture: string,
    public readonly city: string,
    public readonly street: string
  ) {}
}
