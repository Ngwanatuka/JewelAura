import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Login from '../Login';
import userReducer from '../../redux/userRedux';

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      user: userReducer,
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

describe('Login Component', () => {
  test('should render login form', () => {
    renderWithProviders(<Login />);
    expect(screen.getByText('SIGN IN')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('password')).toBeInTheDocument();
  });

  test('should handle input changes', () => {
    renderWithProviders(<Login />);
    const usernameInput = screen.getByPlaceholderText('username');
    const passwordInput = screen.getByPlaceholderText('password');
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    
    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('testpass');
  });

  test('should show error when login fails', () => {
    const initialState = {
      user: { error: true }
    };
    renderWithProviders(<Login />, initialState);
    expect(screen.getByText('Something went wrong...')).toBeInTheDocument();
  });
});