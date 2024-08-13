import { axiosInstance } from "../auth/authApi";

export const fetchLoggedInUserOrders = async (id) => {
  const response = await axiosInstance.get(`/orders/own/${id}`);
  return response;
};

export function updateUser(update) {
  try{
    const response = axiosInstance.post(`/user/${update._id}`, update);
    return response;
  }catch(err){
    console.log(err);
  }
}

 