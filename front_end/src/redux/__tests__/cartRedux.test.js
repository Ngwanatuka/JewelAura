import cartReducer, { addProduct, clearCart } from '../cartRedux';

describe('cartRedux', () => {
  const initialState = {
    products: [],
    quantity: 0,
    total: 0,
  };

  test('should return initial state', () => {
    expect(cartReducer(undefined, {})).toEqual(initialState);
  });

  test('should handle addProduct', () => {
    const product = { 
      _id: '1', 
      title: 'Test Product', 
      price: 100, 
      quantity: 2 
    };
    const action = addProduct(product);
    const state = cartReducer(initialState, action);
    
    expect(state.products).toHaveLength(1);
    expect(state.quantity).toBe(1); // addProduct increases by 1, not by product.quantity
    expect(state.total).toBe(200); // price * product.quantity
  });

  test('should handle clearCart', () => {
    const stateWithItems = {
      products: [{ _id: '1', title: 'Test', price: 100, quantity: 1 }],
      quantity: 1,
      total: 100,
    };
    
    const action = clearCart();
    const state = cartReducer(stateWithItems, action);
    
    expect(state.products).toHaveLength(0);
    expect(state.quantity).toBe(0);
    expect(state.total).toBe(0);
  });
});