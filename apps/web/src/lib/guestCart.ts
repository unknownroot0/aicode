import { useCartStore } from "@/store/cartStore";
import { cartAPI } from "./services";

export const syncGuestCartToAccount = async () => {
  const { items, clearCart, setItems } = useCartStore.getState();

  if (items.length === 0) {
    const serverCart = await cartAPI.getCart().catch(() => null);
    if (serverCart?.items) {
      setItems(serverCart.items);
    }
    return;
  }

  const results = await Promise.allSettled(
    items.map((item) =>
      cartAPI.addItem({
        productId: item.productId,
        quantity: item.quantity,
      })
    )
  );

  const failedCount = results.filter((result) => result.status === "rejected").length;
  const serverCart = await cartAPI.getCart().catch(() => null);

  if (serverCart?.items) {
    setItems(serverCart.items);
  } else {
    clearCart();
  }

  return { failedCount };
};
