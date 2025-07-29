import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Product from '../Product';
import cartReducer from '../../redux/cartRedux';
import userReducer from '../../redux/userRedux';

const mockProduct = {
  _id: '1',
  title: 'Diamond Ring',
  img: 'ring.jpg',
  price: 1000
};

const mockStore = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer
  }
});

const renderWithProviders = (component) => {
  return render(
    <Provider store={mockStore}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('Product Component', () => {
  test('should render product image', () => {
    renderWithProviders(<Product item={mockProduct} />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'ring.jpg');
  });

  test('should have shopping and favorite icons', () => {
    renderWithProviders(<Product item={mockProduct} />);
    
    // Check for SVG icons (Material-UI icons render as SVG)
    const svgIcons = document.querySelectorAll('svg');
    expect(svgIcons.length).toBe(3); // cart, search, favorite icons
  });

  test('should have product link', () => {
    renderWithProviders(<Product item={mockProduct} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/product/1');
  });
});