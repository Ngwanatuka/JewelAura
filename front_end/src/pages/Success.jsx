import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { CheckCircle, LocalShipping, Receipt, Home } from '@mui/icons-material';
import { verifyPayment } from '../services/orders';
import { clearCart } from '../redux/cartRedux';
import Navbar from '../components/Navbar';
import Announcement from '../components/Announcement';
import Footer from '../components/Footer';

const Container = styled.div`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const Content = styled.div`
  max-width: 800px;
  width: 100%;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
`;

const SuccessIcon = styled(CheckCircle)`
  font-size: 80px !important;
  color: #4caf50;
  display: block;
  margin: 0 auto 20px;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 10px;
  font-size: 32px;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 40px;
  font-size: 16px;
`;

const OrderInfo = styled.div`
  background: #f9f9f9;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #e0e0e0;

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.span`
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Value = styled.span`
  color: #333;
  font-weight: 600;
  font-size: 16px;
`;

const ProductList = styled.div`
  margin-top: 20px;
`;

const ProductItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #e0e0e0;

  &:last-child {
    border-bottom: none;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductTitle = styled.span`
  color: #333;
  font-weight: 500;
  font-size: 14px;
`;

const ProductQuantity = styled.span`
  color: #666;
  font-size: 12px;
`;

const ProductPrice = styled.span`
  color: #333;
  font-weight: 600;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  flex: 1;
  min-width: 200px;
  padding: 16px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #00a9e0 0%, #0088b8 100%);
  color: white;
`;

const SecondaryButton = styled(Button)`
  background: white;
  color: #333;
  border: 2px solid #ddd;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 60px 20px;
`;

const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #00a9e0;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 40px 20px;
`;

const ErrorIcon = styled.div`
  font-size: 60px;
  color: #f44336;
  margin-bottom: 20px;
`;

const ErrorTitle = styled.h2`
  color: #333;
  margin-bottom: 10px;
`;

const ErrorMessage = styled.p`
  color: #666;
  margin-bottom: 30px;
`;

const AddressSection = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
`;

const AddressTitle = styled.h3`
  color: #333;
  font-size: 16px;
  margin-bottom: 10px;
`;

const AddressText = styled.p`
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
`;

const Success = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderData, setOrderData] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      setError('No order ID provided');
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const data = await verifyPayment(orderId);
        setOrderData(data);

        // Clear the cart after successful payment verification
        dispatch(clearCart());
      } catch (err) {
        console.error('Payment verification failed:', err);
        setError(err.error || 'Failed to verify payment. Please contact support.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [searchParams, dispatch]);

  if (loading) {
    return (
      <>
        <Navbar />
        <Announcement />
        <Container>
          <Content>
            <LoadingContainer>
              <Spinner />
              <p>Verifying your payment...</p>
            </LoadingContainer>
          </Content>
        </Container>
        <Footer />
      </>
    );
  }

  if (error || !orderData) {
    return (
      <>
        <Navbar />
        <Announcement />
        <Container>
          <Content>
            <ErrorContainer>
              <ErrorIcon>⚠️</ErrorIcon>
              <ErrorTitle>Payment Verification Failed</ErrorTitle>
              <ErrorMessage>{error || 'Unable to verify your payment'}</ErrorMessage>
              <ButtonGroup>
                <SecondaryButton onClick={() => navigate('/orders')}>
                  <Receipt /> View Orders
                </SecondaryButton>
                <PrimaryButton onClick={() => navigate('/')}>
                  <Home /> Go Home
                </PrimaryButton>
              </ButtonGroup>
            </ErrorContainer>
          </Content>
        </Container>
        <Footer />
      </>
    );
  }

  const { orderId, amount, products, address, status, deliveryStatus, createdAt } = orderData;
  const orderIdShort = orderId.toString().slice(-8).toUpperCase();

  return (
    <>
      <Navbar />
      <Announcement />
      <Container>
        <Content>
          <SuccessIcon />
          <Title>Payment Successful!</Title>
          <Subtitle>Thank you for your order. We've received your payment and are processing your order.</Subtitle>

          <OrderInfo>
            <InfoRow>
              <Label><Receipt /> Order ID</Label>
              <Value>#{orderIdShort}</Value>
            </InfoRow>
            <InfoRow>
              <Label>Total Amount</Label>
              <Value>R{amount?.toFixed(2)}</Value>
            </InfoRow>
            <InfoRow>
              <Label>Order Status</Label>
              <Value style={{ color: status === 'completed' ? '#4caf50' : '#ff9800' }}>
                {status === 'completed' ? 'Confirmed' : 'Pending'}
              </Value>
            </InfoRow>
            <InfoRow>
              <Label><LocalShipping /> Delivery Status</Label>
              <Value>{deliveryStatus || 'Processing'}</Value>
            </InfoRow>
            <InfoRow>
              <Label>Order Date</Label>
              <Value>{new Date(createdAt).toLocaleDateString()}</Value>
            </InfoRow>

            {products && products.length > 0 && (
              <ProductList>
                <h3 style={{ marginTop: '20px', marginBottom: '15px', color: '#333' }}>Order Items</h3>
                {products.map((product, index) => (
                  <ProductItem key={index}>
                    <ProductInfo>
                      {product.img && <ProductImage src={product.img} alt={product.title} />}
                      <ProductDetails>
                        <ProductTitle>{product.title || 'Product'}</ProductTitle>
                        <ProductQuantity>Quantity: {product.quantity}</ProductQuantity>
                      </ProductDetails>
                    </ProductInfo>
                    <ProductPrice>R{(product.price * product.quantity).toFixed(2)}</ProductPrice>
                  </ProductItem>
                ))}
              </ProductList>
            )}

            {address && (
              <AddressSection>
                <AddressTitle>Shipping Address</AddressTitle>
                <AddressText>
                  {address.firstName} {address.lastName}<br />
                  {address.street}<br />
                  {address.city}, {address.province} {address.postalCode}
                </AddressText>
              </AddressSection>
            )}
          </OrderInfo>

          <ButtonGroup>
            <PrimaryButton onClick={() => navigate('/orders')}>
              <Receipt /> View Order History
            </PrimaryButton>
            <SecondaryButton onClick={() => navigate('/')}>
              <Home /> Continue Shopping
            </SecondaryButton>
          </ButtonGroup>
        </Content>
      </Container>
      <Footer />
    </>
  );
};

export default Success;
