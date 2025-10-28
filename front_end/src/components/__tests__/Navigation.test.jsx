import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
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
      {component}
    </Provider>
  );
};

describe('Navigation Flow Tests', () => {
  test('should show landing page for unauthenticated users', () => {
    renderWithProviders(<App />);
    
    // Should show landing page content
    expect(screen.getByText(/welcome to jewelaura/i)).toBeInTheDocument();
  });

  test('should show home page for authenticated users', () => {
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
    
    // Should not show landing page content
    expect(screen.queryByText(/welcome to jewelaura/i)).not.toBeInTheDocument();
  });

  test('should handle user authentication state', () => {
    const { rerender } = renderWithProviders(<App />);
    
    // Initially unauthenticated - should show landing
    expect(screen.getByText(/welcome to jewelaura/i)).toBeInTheDocument();
    
    // After authentication - should show home
    const authenticatedState = {
      user: {
        currentUser: { _id: '123', username: 'testuser' },
        isFetching: false,
        error: false
      }
    };
    
    rerender(
      <Provider store={createTestStore(authenticatedState)}>
        <App />
      </Provider>
    );
    
    expect(screen.queryByText(/welcome to jewelaura/i)).not.toBeInTheDocument();
  });
});