import { axiosInstance } from "../auth/authApi";

export function fetchItemsByUserId() {
  const response = axiosInstance.get("/cart");
  return response;
}

export function addToCart(item) {
  const response = axiosInstance.post("/cart", item);
  return response;
}
export function updateCart(update) {
  const response = axiosInstance.post(`/cart/${update.id}`, update);
  return response;
}

export function deleteItemFromCart(itemId) {
  return new Promise(async (resolve) => {
    const response = await fetch("/cart/" + itemId, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    // TODO: on server it will only return some info of user (not password)
    resolve({ data: { id: itemId } });
  }); 
}

export function resetCart() {
  // get all items of user's cart - and then delete each
  return new Promise(async (resolve) => {
    const response = await fetchItemsByUserId();
    const items = response.data;
    for (let item of items) {
      await deleteItemFromCart(item.id);
    }
    resolve({ status: "success" });
  });
}
