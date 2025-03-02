import HttpStatus from "@/domain/model/network/http/HttpStatus";
import { axios } from "@/infrastructure/network/AxiosInstance";
import ShopInfo from "@/domain/model/shop/ShopInfo";

export default class ShopRegisterTransfer {
  public async registerShop(shopInfo: ShopInfo): Promise<void> {
    const params = {
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
        .post("/shops/info", params)
        .catch((error: { response: any }) => error.response);

      const statusCode = new HttpStatus(response.status);
      console.log("response=", response);

      if (statusCode.isSuccess() && response.data) {
        console.log("Insert Success");
      } else if (statusCode.isError()) {
        console.error("shoplist is not an array or not found");
      }
    } catch (error) {
      console.error("Error fetching shop register:", error);
    } finally {
      console.log("登録成功");
    }
  }
}
