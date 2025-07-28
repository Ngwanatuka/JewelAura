import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Checkout from '../Checkout';
import cartReducer from '../../redux/cartRedux';
import userReducer from '../../redux/userRedux';

const mockStore = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer
  },
  preloadedState: {
    cart: {
      products: [
        { _id: '1', title: 'Ring', price: 50, quantity: 2 }
      ],
      total: 100
    },
    user: {
      currentUser: { _id: 'user123' }
    }
  }
});

const renderCheckout = () => {
  return render(
    <Provider store={mockStore}>
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    </Provider>
  );
};

describe('Checkout Component', () => {
  it('should render checkout form', () => {
    renderCheckout();
    
    expect(screen.getByText('Checkout')).toBeInTheDocument();
  });

  it('should render shipping address form', () => {
    renderCheckout();
    
    expect(screen.getByText('Shipping Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Street Address')).toBeInTheDocument();
  });

  it('should render place order button', () => {
    renderCheckout();
    
    expect(screen.getByText('Place Order')).toBeInTheDocument();
  });
});