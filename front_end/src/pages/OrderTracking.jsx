import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OrderTimeline from "../components/OrderTimeline";
import { userRequest } from "../requestMethods";

const Container = styled.div``;

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
`;

const Title = styled.h1`
  font-size: 32px;
  margin-bottom: 30px;
  color: #333;
`;

const OrderCard = styled.div`
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 30px;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f5f5f5;
`;

const OrderNumber = styled.h2`
  font-size: 24px;
  color: #333;
  margin: 0;
`;

const StatusBadge = styled.span`
  background: ${props => {
        switch (props.status) {
            case "delivered": return "#27ae60";
            case "shipped": return "#3498db";
            case "processing": return "#f39c12";
            default: return "#95a5a6";
        }
    }};
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  text-transform: capitalize;
`;

const InfoSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px 0;
`;

const InfoItem = styled.div`
  background: #f9f9f9;
  padding: 15px;
  border-radius: 6px;
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
  margin-bottom: 5px;
  font-weight: 600;
`;

const InfoValue = styled.div`
  font-size: 16px;
  color: #333;
  font-weight: 500;
`;

const TrackingSection = styled.div`
  background: #f0f8ff;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
`;

const TrackingTitle = styled.h3`
  margin: 0 0 15px 0;
  color: #333;
`;

const ProductsList = styled.div`
  margin-top: 30px;
`;

const ProductItem = styled.div`
  display: flex;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const ProductName = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
`;

const ProductQuantity = styled.div`
  color: #666;
  font-size: 14px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
`;

const OrderTracking = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrderTracking = async () => {
            try {
                const response = await userRequest.get(`/orders/${orderId}/tracking`);
                setOrder(response.data);
            } catch (err) {
                setError(err.response?.data || "Failed to load order tracking");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderTracking();
    }, [orderId]);

    if (loading) {
        return (
            <Container>
                <Navbar />
                <Wrapper>
                    <LoadingMessage>Loading order tracking...</LoadingMessage>
                </Wrapper>
                <Footer />
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Navbar />
                <Wrapper>
                    <ErrorMessage>{error}</ErrorMessage>
                </Wrapper>
                <Footer />
            </Container>
        );
    }

    return (
        <Container>
            <Navbar />
            <Wrapper>
                <Title>Order Tracking</Title>

                <OrderCard>
                    <OrderHeader>
                        <OrderNumber>
                            Order #{order.orderId.toString().slice(-8).toUpperCase()}
                        </OrderNumber>
                        <StatusBadge status={order.deliveryStatus}>
                            {order.deliveryStatus.replace("_", " ")}
                        </StatusBadge>
                    </OrderHeader>

                    <InfoSection>
                        <InfoItem>
                            <InfoLabel>Order Date</InfoLabel>
                            <InfoValue>
                                {new Date(order.createdAt).toLocaleDateString()}
                            </InfoValue>
                        </InfoItem>

                        {order.trackingNumber && (
                            <InfoItem>
                                <InfoLabel>Tracking Number</InfoLabel>
                                <InfoValue>{order.trackingNumber}</InfoValue>
                            </InfoItem>
                        )}

                        {order.shippingCarrier && (
                            <InfoItem>
                                <InfoLabel>Carrier</InfoLabel>
                                <InfoValue>{order.shippingCarrier}</InfoValue>
                            </InfoItem>
                        )}

                        {order.estimatedDelivery && (
                            <InfoItem>
                                <InfoLabel>Estimated Delivery</InfoLabel>
                                <InfoValue>
                                    {new Date(order.estimatedDelivery).toLocaleDateString()}
                                </InfoValue>
                            </InfoItem>
                        )}
                    </InfoSection>

                    <TrackingSection>
                        <TrackingTitle>Delivery Progress</TrackingTitle>
                        <OrderTimeline order={order} />
                    </TrackingSection>
                </OrderCard>
            </Wrapper>
            <Footer />
        </Container>
    );
};

export default OrderTracking;
