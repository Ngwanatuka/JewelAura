import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Landing from '../Landing';
import userReducer from '../../redux/userRedux';

const mockStore = configureStore({
  reducer: {
    user: userReducer
  }
});

const renderLanding = () => {
  return render(
    <Provider store={mockStore}>
      <BrowserRouter>
        <Landing />
      </BrowserRouter>
    </Provider>
  );
};

describe('Landing Page', () => {
  it('should render hero section', () => {
    renderLanding();

    expect(screen.getByText('Welcome to JewelAura')).toBeInTheDocument();
  });

  it('should render call-to-action button', () => {
    renderLanding();

    expect(screen.getByText('Shop Now')).toBeInTheDocument();
  });

  it('should render featured categories section', () => {
    renderLanding();

    expect(screen.getByText('Featured Categories')).toBeInTheDocument();
  });

  it('should render why choose us section', () => {
    renderLanding();

    expect(screen.getByText('Why Choose JewelAura?')).toBeInTheDocument();
  });

  it('should render testimonials section', () => {
    renderLanding();

    expect(screen.getByText('What Our Customers Say')).toBeInTheDocument();
  });
});