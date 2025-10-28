import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Product from '../../components/Product';
import cartReducer from '../../redux/cartRedux';
import userReducer from '../../redux/userRedux';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

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

describe('Authentication Redirect Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should redirect unauthenticated user to login when adding to cart', () => {
    renderWithProviders(<Product item={mockProduct} />);
    
    const addToCartButton = screen.getByTestId('add-to-cart');
    fireEvent.click(addToCartButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('should not redirect authenticated user when adding to cart', () => {
    const authenticatedState = {
      user: {
        currentUser: { _id: '123', username: 'testuser' },
        isFetching: false,
        error: false
      }
    };

    renderWithProviders(<Product item={mockProduct} />, { initialState: authenticatedState });
    
    const addToCartButton = screen.getByTestId('add-to-cart');
    fireEvent.click(addToCartButton);
    
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});