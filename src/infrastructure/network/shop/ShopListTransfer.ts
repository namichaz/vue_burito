import HttpStatus from "@/domain/model/network/http/HttpStatus";
import { axios } from "@/infrastructure/network/AxiosInstance";
import { ShopListResponse } from "@/infrastructure/network/shop/res/ShopListResponse";
import ShopInfo from "@/domain/model/shop/ShopInfo";

export default class ShopListTransfer {
  public async getShopList(): Promise<ShopInfo[]> {
    let shopList: ShopInfo[] = new Array(ShopInfo.empty());
    try {
      const response = await axios
        .get("/shops/info")
        .catch((error: { response: any }) => error.response);

      const statusCode = new HttpStatus(response.status);
      if (statusCode.isSuccess() && response.data) {
        const shopListResponse: ShopListResponse = response.data;
        shopList = shopListResponse.shopList.map((shop) =>
          ShopInfo.of(shop.shop, shop.address, shop.menuList)
        );
      } else if (statusCode.isError()) {
        console.error("shoplist is not an array or not found");
        shopList = new Array(ShopInfo.empty());
      }
    } catch (error) {
      console.error("Error fetching shop list:", error);
      shopList = new Array(ShopInfo.empty());
    } finally {
      return shopList;
    }
  }
}
