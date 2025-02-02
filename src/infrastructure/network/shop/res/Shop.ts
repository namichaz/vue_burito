export interface Shop {
  shop_id: number;
  shop_name: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
}
