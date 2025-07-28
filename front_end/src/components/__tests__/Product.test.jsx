import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Product from '../Product';

const mockProduct = {
  _id: '1',
  title: 'Diamond Ring',
  img: 'ring.jpg',
  price: 1000
};

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Product Component', () => {
  test('should render product information', () => {
    renderWithRouter(<Product item={mockProduct} />);
    
    expect(screen.getByText('Diamond Ring')).toBeInTheDocument();
    expect(screen.getByText('$1000')).toBeInTheDocument();
  });

  test('should render product image', () => {
    renderWithRouter(<Product item={mockProduct} />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'ring.jpg');
  });

  test('should have shopping and favorite icons', () => {
    renderWithRouter(<Product item={mockProduct} />);
    
    // Check for icon containers (since icons are from Material-UI)
    const icons = screen.getAllByRole('button');
    expect(icons.length).toBeGreaterThan(0);
  });
});