import {
  ADD_TO_CART,
  GET_SINGLE_ITEM,
} from "../actionType";

export const getSingleItem = (productId) => ({
    type: GET_SINGLE_ITEM,
    payload: { productId },
  });
  
  export const addToCart = (product, qty) => (dispatch) => {
    dispatch(addToCartUnsafe(product, qty));
  };
  
  export const addToCartUnsafe = (product, qty) => ({
    type: ADD_TO_CART,
    payload: { product, qty },
  });
  
  
  