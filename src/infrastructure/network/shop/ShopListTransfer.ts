import HttpStatus from "@/domain/model/network/http/HttpStatus.ts";
import { axios } from "@/infrastructure/network/AxiosInstance.ts";
import Shop from "../../../domain/model/shop/Shop";
import { ShopListResponse } from "./res/ShopListResponse";

export default class ShopListTransfer {
  public async getShopList(): Promise<Shop[]> {
    const response = await axios
      .get("/info/shops")
      .catch((error: { response: any }) => error.response);

    const statusCode = new HttpStatus(response.status);
    if (statusCode.isSuccess() && response.data) {
      const shopListResponse: ShopListResponse = response.data;
      return shopListResponse.shoplist.map((shop) =>
        Shop.of(shop.shop_id, shop.shop_name, shop.location)
      );
    }
    return [];
  }
}
