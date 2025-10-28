import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Landing from '../../pages/Landing';
import App from '../../App';
import cartReducer from '../../redux/cartRedux';
import userReducer from '../../redux/userRedux';

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      user: userReducer
    },
    preloadedState: {
      cart: { products: [], quantity: 0, total: 0 },
      user: { currentUser: null, isFetching: false, error: false },
      ...initialState
    }
  });
};

const renderWithProviders = (component, { initialState = {} } = {}) => {
  const store = createTestStore(initialState);
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('Shop Now Button Tests', () => {
  test('should have Shop Now button linking to home page', () => {
    renderWithProviders(<Landing />);
    
    const shopNowButton = screen.getByText(/shop now/i);
    expect(shopNowButton).toHaveAttribute('href', '/home');
  });

  test('should show Shop Now button on landing page', () => {
    renderWithProviders(<Landing />);
    
    expect(screen.getByText(/shop now/i)).toBeInTheDocument();
  });
});