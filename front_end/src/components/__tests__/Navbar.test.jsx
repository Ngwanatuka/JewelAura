import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Navbar from '../Navbar';
import userReducer from '../../redux/userRedux';
import cartReducer from '../../redux/cartRedux';

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      user: userReducer,
      cart: cartReducer,
    },
    preloadedState: initialState,
  });
};

const renderWithProviders = (component, initialState = {}) => {
  const store = createTestStore(initialState);
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('Navbar Component', () => {
  test('should render logo', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByText('JEWELAURA')).toBeInTheDocument();
  });

  test('should show login/register when user not logged in', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByText('SIGN IN')).toBeInTheDocument();
    expect(screen.getByText('REGISTER')).toBeInTheDocument();
  });

  test('should show cart badge with quantity', () => {
    const initialState = {
      cart: { quantity: 3 }
    };
    renderWithProviders(<Navbar />, initialState);
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});