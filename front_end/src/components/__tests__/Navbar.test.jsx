import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Navbar from '../Navbar';
import cartReducer from '../../redux/cartRedux';
import userReducer from '../../redux/userRedux';

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      user: userReducer,
    },
    preloadedState: {
      cart: { quantity: 0, ...initialState.cart },
      user: { currentUser: null, ...initialState.user },
    },
  });
};

const renderWithProviders = (component, initialState = {}) => {
  const store = createMockStore(initialState);
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('Navbar Component', () => {
  it('renders navbar with logo', () => {
    renderWithProviders(<Navbar />);
    
    expect(screen.getByText('JewelAura')).toBeInTheDocument();
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  });

  it('displays cart quantity badge', () => {
    renderWithProviders(<Navbar />, { cart: { quantity: 3 } });
    
    const badge = screen.getByText('3');
    expect(badge).toBeInTheDocument();
  });

  it('handles search input', () => {
    renderWithProviders(<Navbar />);
    
    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'diamond ring' } });
    
    expect(searchInput.value).toBe('diamond ring');
  });

  it('has working navigation links', () => {
    renderWithProviders(<Navbar />);
    
    const logoLink = screen.getByText('JewelAura').closest('a');
    const loginLink = screen.getByText('Signout').closest('a');
    
    expect(logoLink).toHaveAttribute('href', '/');
    expect(loginLink).toHaveAttribute('href', '/login');
  });
});