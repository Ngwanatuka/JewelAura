import cartReducer, { addProduct, decreaseQuantity, increaseQuantity, removeItem } from '../cartRedux';

describe('Cart Redux', () => {
  const initialState = {
    products: [],
    quantity: 0,
    total: 0,
  };

  const mockProduct = {
    _id: '1',
    title: 'Diamond Ring',
    price: 1000,
    quantity: 1,
  };

  it('should return initial state', () => {
    expect(cartReducer(undefined, {})).toEqual(initialState);
  });

  it('should add product to cart', () => {
    const action = addProduct(mockProduct);
    const state = cartReducer(initialState, action);

    expect(state.products).toHaveLength(1);
    expect(state.quantity).toBe(1);
    expect(state.total).toBe(1000);
    expect(state.products[0]).toEqual(mockProduct);
  });

  it('should increase product quantity', () => {
    const stateWithProduct = {
      products: [mockProduct],
      quantity: 1,
      total: 1000,
    };

    const action = increaseQuantity('1');
    const state = cartReducer(stateWithProduct, action);

    expect(state.products[0].quantity).toBe(2);
    expect(state.quantity).toBe(2);
    expect(state.total).toBe(2000);
  });

  it('should decrease product quantity', () => {
    const stateWithProduct = {
      products: [{ ...mockProduct, quantity: 2 }],
      quantity: 2,
      total: 2000,
    };

    const action = decreaseQuantity('1');
    const state = cartReducer(stateWithProduct, action);

    expect(state.products[0].quantity).toBe(1);
    expect(state.quantity).toBe(1);
    expect(state.total).toBe(1000);
  });

  it('should remove item from cart', () => {
    const stateWithProduct = {
      products: [mockProduct],
      quantity: 1,
      total: 1000,
    };

    const action = removeItem('1');
    const state = cartReducer(stateWithProduct, action);

    expect(state.products).toHaveLength(0);
    expect(state.quantity).toBe(0);
    expect(state.total).toBe(0);
  });

  it('should handle multiple products', () => {
    const product2 = {
      _id: '2',
      title: 'Gold Necklace',
      price: 800,
      quantity: 1,
    };

    let state = cartReducer(initialState, addProduct(mockProduct));
    state = cartReducer(state, addProduct(product2));

    expect(state.products).toHaveLength(2);
    expect(state.quantity).toBe(2);
    expect(state.total).toBe(1800);
  });
});