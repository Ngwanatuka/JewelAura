import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { processCheckout } from '../services/checkoutService';

const Container = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Section = styled.div`
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 5px;
`;

const SectionTitle = styled.h3`
  margin-bottom: 15px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 3px;
  margin-bottom: 10px;
`;

const Button = styled.button`
  padding: 15px;
  background-color: teal;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    background-color: rgb(110, 152, 152);
  }
`;

const Checkout = () => {
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: ''
  });
  const [loading, setLoading] = useState(false);
  
  const cart = useSelector(state => state.cart);
  const user = useSelector(state => state.user);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await processCheckout({
        userId: user.currentUser?._id,
        products: cart.products,
        amount: cart.total,
        address,
        tokenId: 'tok_test' // In real app, this would come from Stripe
      });

      if (result.success) {
        navigate('/success');
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Checkout</Title>
      <Form onSubmit={handleSubmit}>
        <Section>
          <SectionTitle>Shipping Address</SectionTitle>
          <Input
            type="text"
            placeholder="Street Address"
            value={address.street}
            onChange={(e) => setAddress({...address, street: e.target.value})}
            required
          />
          <Input
            type="text"
            placeholder="City"
            value={address.city}
            onChange={(e) => setAddress({...address, city: e.target.value})}
            required
          />
          <Input
            type="text"
            placeholder="State"
            value={address.state}
            onChange={(e) => setAddress({...address, state: e.target.value})}
            required
          />
          <Input
            type="text"
            placeholder="ZIP Code"
            value={address.zip}
            onChange={(e) => setAddress({...address, zip: e.target.value})}
            required
          />
        </Section>
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Place Order'}
        </Button>
      </Form>
    </Container>
  );
};

export default Checkout;