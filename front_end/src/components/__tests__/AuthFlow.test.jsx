import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Login from '../../pages/Login';
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

describe('Authentication Flow Tests', () => {
  test('should render login form elements', () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('should show login page title', () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  test('should have register link', () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByText(/create a new account/i)).toBeInTheDocument();
  });
});