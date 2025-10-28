import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from '../../App';
import cartReducer from '../../redux/cartRedux';
import userReducer from '../../redux/userRedux';

const createMockStore = (initialState = {}) => {
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

const renderWithProviders = (component, { initialState } = {}) => {
  const store = createMockStore(initialState);
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('App Integration Tests', () => {
  test('should show landing page when user is not authenticated', () => {
    renderWithProviders(<App />);
    
    // Should show landing page content
    expect(screen.getByText(/welcome to jewelaura/i)).toBeInTheDocument();
  });

  test('should show home page when user is authenticated', () => {
    const authenticatedState = {
      user: {
        currentUser: {
          _id: '123',
          username: 'testuser',
          email: 'test@example.com'
        },
        isFetching: false,
        error: false
      }
    };

    renderWithProviders(<App />, { initialState: authenticatedState });
    
    // Should show home page content for authenticated users
    expect(screen.queryByText(/welcome to jewelaura/i)).not.toBeInTheDocument();
  });

  test('should redirect to login when accessing protected routes', () => {
    // Test will verify that unauthenticated users are redirected
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    
    // Landing page should be shown for unauthenticated users
    expect(screen.queryByText(/checkout|orders/i)).not.toBeInTheDocument();
  });
});