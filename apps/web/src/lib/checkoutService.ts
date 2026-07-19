import { orderAPI } from "./services";

export type PlaceOrderParams = {
  fullName: string;
  phone: string;
  fullAddress: string;
  notes?: string;
  paymentMethod: "cod" | "online";
  shippingZone: "inside" | "sub" | "outside";
  couponCode?: string;
  email?: string;
  items?: { productId: string; quantity: number }[];
};

export class CheckoutService {
  static async placeOrder(params: PlaceOrderParams) {
    const result = await orderAPI.checkout(params);

    if (!result?.order?.id) {
      throw new Error("Order API returned invalid response");
    }

    if (!result.redirectUrl) {
      throw new Error("Order API did not return a redirect URL");
    }

    return result;
  }

  static shippingCostForZone(zone: string) {
    if (zone === "inside") return 70;
    if (zone === "sub") return 110;
    return 130;
  }
}

export default CheckoutService;
