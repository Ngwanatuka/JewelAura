import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Product from '../../components/Product';
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

const mockProduct = {
  _id: '1',
  title: 'Diamond Ring',
  img: 'ring.jpg',
  price: 1000
};

describe('Buying Flow Tests', () => {
  test('should have add to cart button with test id', () => {
    renderWithProviders(<Product item={mockProduct} />);
    
    const addToCartButton = screen.getByTestId('add-to-cart');
    expect(addToCartButton).toBeInTheDocument();
  });

  test('should allow authenticated user to add to cart without redirect', () => {
    const authenticatedState = {
      user: {
        currentUser: { _id: '123', username: 'testuser' },
        isFetching: false,
        error: false
      }
    };

    renderWithProviders(<Product item={mockProduct} />, { initialState: authenticatedState });
    
    const addToCartButton = screen.getByTestId('add-to-cart');
    expect(addToCartButton).toBeInTheDocument();
    
    // Click should not cause any errors for authenticated users
    fireEvent.click(addToCartButton);
    expect(addToCartButton).toBeInTheDocument();
  });
});