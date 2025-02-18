import HttpStatus from "@/domain/model/network/http/HttpStatus";
import ShopInfo from "@/domain/model/shop/ShopInfo";
import { axios } from "@/infrastructure/network/AxiosInstance";

export default class ShopUpdateTransfer {
  public async deleteShop(shopInfo: ShopInfo): Promise<void> {
    const params = {
      shopId: shopInfo.shop.shop_id.toString(),
      shopName: shopInfo.shop.shop_name.toString(),
      prefecture: shopInfo.address.prefecture.toString(),
      city: shopInfo.address.city.toString(),
      street: shopInfo.address.street.toString(),
      latitude: shopInfo.address.latitude.toString(),
      longitude: shopInfo.address.longitude.toString(),
      menuItem: shopInfo.menuList,
    };

    try {
      const response = await axios
        .post("/shops/info/", params)
        .catch((error: { response: any }) => error.response);

      const statusCode = new HttpStatus(response.status);
      if (statusCode.isSuccess()) {
        console.log("Update Success");
      } else if (statusCode.isSessionInvalid()) {
        console.error("Session Invalid");
      } else if (statusCode.isError()) {
        console.error("shoplist is not an array or not found");
      }
    } catch (error) {
      console.error("Failed Update:", error);
    }
  }
}
