import { userRequest } from '../requestMethods';

export const processCheckout = async (checkoutData) => {
  try {
    const response = await userRequest.post('/checkout', checkoutData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Checkout failed');
  }
};