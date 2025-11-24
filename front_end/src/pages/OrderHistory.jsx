import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Announcement from "../components/Announcement";
import Footer from "../components/Footer";
import { getUserOrders } from "../services/orders";
import { format } from "date-fns";

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 50px;
`;

const Title = styled.h1`
  font-weight: 300;
  text-align: center;
  margin-bottom: 30px;
`;

const OrdersContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const OrderCard = styled.div`
  background-color: #f5fafd;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ddd;
`;

const OrderId = styled.div`
  font-weight: 600;
  color: #333;
`;

const OrderDate = styled.div`
  color: #666;
  font-size: 14px;
`;

const OrderDetails = styled.div`
  margin-bottom: 15px;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const ItemInfo = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 5px;
`;

const ItemDetails = styled.div``;

const ItemTitle = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
`;

const ItemQuantity = styled.div`
  color: #666;
  font-size: 14px;
`;

const ItemPrice = styled.div`
  font-weight: 600;
  color: teal;
`;

const OrderFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 2px solid #ddd;
`;

const OrderStatus = styled.div`
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${(props) =>
    props.status === "pending" ? "#ffa726" :
      props.status === "approved" ? "#66bb6a" :
        "#ef5350"};
  color: white;
`;

const OrderTotal = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #333;
`;

const TrackButton = styled.button`
  background: #d4af37;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;

  &:hover {
    background: #c19b2e;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: #666;
`;

const OrderHistory = () => {
  const user = useSelector((state) => state.user.currentUser);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const data = await getUserOrders(user._id, user.accessToken);
          setOrders(data);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <Container>
        <Navbar />
        <Announcement />
        <Wrapper>
          <Title>Loading...</Title>
        </Wrapper>
        <Footer />
      </Container>
    );
  }

  return (
    <Container>
      <Navbar />
      <Announcement />
      <Wrapper>
        <Title>Order History</Title>
        {orders.length === 0 ? (
          <EmptyMessage>
            You haven't placed any orders yet. Start shopping!
          </EmptyMessage>
        ) : (
          <OrdersContainer>
            {orders.map((order) => (
              <OrderCard key={order._id}>
                <OrderHeader>
                  <OrderId>Order #{order._id.slice(-8).toUpperCase()}</OrderId>
                  <OrderDate>
                    {order.createdAt && format(new Date(order.createdAt), "MMM dd, yyyy")}
                  </OrderDate>
                </OrderHeader>
                <OrderDetails>
                  {order.products?.map((item, index) => (
                    <OrderItem key={index}>
                      <ItemInfo>
                        <ItemImage src={item.img || "/placeholder.jpg"} alt={item.title} />
                        <ItemDetails>
                          <ItemTitle>{item.title || "Product"}</ItemTitle>
                          <ItemQuantity>Quantity: {item.quantity}</ItemQuantity>
                        </ItemDetails>
                      </ItemInfo>
                      <ItemPrice>${item.price * item.quantity}</ItemPrice>
                    </OrderItem>
                  ))}
                </OrderDetails>
                <OrderFooter>
                  <OrderStatus status={order.status}>
                    {order.status?.toUpperCase() || "PENDING"}
                  </OrderStatus>
                  <OrderTotal>Total: ${order.amount}</OrderTotal>
                  <TrackButton onClick={() => window.location.href = `/orders/${order._id}/tracking`}>
                    Track Order
                  </TrackButton>
                </OrderFooter>
              </OrderCard>
            ))}
          </OrdersContainer>
        )}
      </Wrapper>
      <Footer />
    </Container>
  );
};

export default OrderHistory;
