import HttpStatus from "@/domain/model/network/http/HttpStatus.ts";
import { axios } from "@/infrastructure/network/AxiosInstance.ts";
import Shop from "../../../domain/model/shop/Shop";
import { ShopListResponse } from "./res/ShopListResponse";

export default class ShopListTransfer {
  public async getShopList(): Promise<Shop[]> {
    let shopList: Shop[] = new Array(Shop.empty());
    try {
      const response = await axios
        .get("/info/shops")
        .catch((error: { response: any }) => error.response);

      const statusCode = new HttpStatus(response.status);
      if (statusCode.isSuccess() && response.data) {
        const shopListResponse: ShopListResponse = response.data;
        shopList = shopListResponse.shopList.map((shop) =>
          Shop.of(shop.shop_id, shop.shop_name, shop.latitude, shop.longitude)
        );
      } else if (statusCode.isError()) {
        console.error("shoplist is not an array or not found");
        shopList = new Array(Shop.empty());
      }
    } catch (error) {
      console.error("Error fetching shop list:", error);
      shopList = new Array(Shop.empty());
    } finally {
      return shopList;
    }
  }
}
