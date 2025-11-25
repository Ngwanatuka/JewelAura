import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { userRequest } from '../requestMethods';

const Container = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 30px;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Section = styled.div`
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  background: white;
`;

const SectionTitle = styled.h3`
  margin-bottom: 15px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #d4af37;
  }
`;

const OrderSummary = styled.div`
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
`;

const TotalRow = styled(SummaryRow)`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  padding-top: 10px;
  border-top: 2px solid #ddd;
  margin-top: 10px;
`;

const PayButton = styled.button`
  padding: 16px;
  background: linear-gradient(135deg, #00a9e0 0%, #0088b8 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 169, 224, 0.4);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const YocoLogo = styled.div`
  text-align: center;
  margin-top: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 6px;
  font-size: 12px;
  color: #666;
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
`;

const Checkout = () => {
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    province: '',
    postalCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cart = useSelector(state => state.cart);
  const user = useSelector(state => state.user);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create Yoco checkout session
      const response = await userRequest.post('/yoco/create-checkout', {
        userId: user.currentUser?._id,
        address
      });

      if (response.data.success) {
        // Redirect to Yoco checkout page
        window.location.href = response.data.checkoutUrl;
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      setError(error.response?.data?.error || 'Payment initiation failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Secure Checkout</Title>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Form onSubmit={handleSubmit}>
        <Section>
          <SectionTitle>Personal Information</SectionTitle>
          <Input
            type="text"
            placeholder="First Name"
            value={address.firstName}
            onChange={(e) => setAddress({ ...address, firstName: e.target.value })}
            required
          />
          <Input
            type="text"
            placeholder="Last Name"
            value={address.lastName}
            onChange={(e) => setAddress({ ...address, lastName: e.target.value })}
            required
          />
        </Section>

        <Section>
          <SectionTitle>Shipping Address</SectionTitle>
          <Input
            type="text"
            placeholder="Street Address"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            required
          />
          <Input
            type="text"
            placeholder="City"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            required
          />
          <Input
            type="text"
            placeholder="Province"
            value={address.province}
            onChange={(e) => setAddress({ ...address, province: e.target.value })}
            required
          />
          <Input
            type="text"
            placeholder="Postal Code"
            value={address.postalCode}
            onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
            required
          />
        </Section>

        <OrderSummary>
          <SectionTitle>Order Summary</SectionTitle>
          <SummaryRow>
            <span>Items ({cart.quantity})</span>
            <span>R{cart.total?.toFixed(2) || '0.00'}</span>
          </SummaryRow>
          <SummaryRow>
            <span>Shipping</span>
            <span>{cart.total >= 1000 ? 'FREE' : 'R50.00'}</span>
          </SummaryRow>
          <TotalRow>
            <span>Total</span>
            <span>R{(cart.total + (cart.total >= 1000 ? 0 : 50)).toFixed(2)}</span>
          </TotalRow>
        </OrderSummary>

        <PayButton type="submit" disabled={loading || cart.quantity === 0}>
          {loading ? 'Redirecting to Yoco...' : 'Proceed to Payment'}
        </PayButton>

        <YocoLogo>
          🔒 Secure payment powered by Yoco
          <br />
          <small>You will be redirected to Yoco to complete your payment</small>
        </YocoLogo>
      </Form>
    </Container>
  );
};

export default Checkout;