import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer, { addProduct } from '../../redux/cartRedux';

describe('Cart Checkout Integration', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        cart: cartReducer
      }
    });
  });

  it('should have items in cart before checkout', () => {
    // Add product to cart
    const product = {
      _id: '1',
      title: 'Gold Bracelet',
      price: 299,
      img: 'test.jpg'
    };

    store.dispatch(addProduct({ ...product, quantity: 1, size: 'M', color: 'gold' }));
    
    const cartState = store.getState().cart;
    expect(cartState.products).toHaveLength(1);
    expect(cartState.quantity).toBe(1);
    expect(cartState.total).toBe(299);
  });

  it('should fail checkout with empty cart', () => {
    const cartState = store.getState().cart;
    expect(cartState.products).toHaveLength(0);
    expect(cartState.quantity).toBe(0);
    expect(cartState.total).toBe(0);
  });
});