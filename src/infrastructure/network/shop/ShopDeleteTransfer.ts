import HttpStatus from "@/domain/model/network/http/HttpStatus";
import { axios } from "@/infrastructure/network/AxiosInstance";

export default class ShopDeleteTransfer {
  public async deleteShop(shopId: number): Promise<void> {
    console.log("delete");
    try {
      const response = await axios
        .delete(`/shops/info/${shopId}`)
        .catch((error: { response: any }) => error.response);

      const statusCode = new HttpStatus(response.status);
      console.log("statusCode=", statusCode);
      if (statusCode.isSuccess()) {
        console.log("Delete Success");
      } else if (statusCode.isSessionInvalid()) {
        console.error("Session Invalid");
      } else if (statusCode.isError()) {
        console.error("shoplist is not an array or not found");
      }
    } catch (error) {
      console.error("Failed Delete:", error);
    }
  }
}
