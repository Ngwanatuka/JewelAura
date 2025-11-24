import styled from "styled-components";
import { CheckCircle, LocalShipping, Inbox, Schedule } from "@material-ui/icons";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 30px 0;
`;

const TimelineItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  position: relative;
  padding-left: 40px;

  &:not(:last-child)::before {
    content: "";
    position: absolute;
    left: 19px;
    top: 40px;
    width: 2px;
    height: calc(100% + 20px);
    background: ${props => props.completed ? "#d4af37" : "#ddd"};
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.completed ? "#d4af37" : "#f5f5f5"};
  color: ${props => props.completed ? "white" : "#999"};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${props => props.completed ? "#d4af37" : "#ddd"};
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.h4`
  margin: 0 0 5px 0;
  color: ${props => props.completed ? "#333" : "#999"};
  font-size: 16px;
  font-weight: 600;
`;

const Description = styled.p`
  margin: 0;
  color: #666;
  font-size: 14px;
`;

const Date = styled.span`
  color: #999;
  font-size: 12px;
  display: block;
  margin-top: 5px;
`;

const OrderTimeline = ({ order }) => {
    const getStatusIcon = (status) => {
        switch (status) {
            case "processing":
                return <Schedule />;
            case "shipped":
                return <LocalShipping />;
            case "in_transit":
                return <LocalShipping />;
            case "out_for_delivery":
                return <Inbox />;
            case "delivered":
                return <CheckCircle />;
            default:
                return <Schedule />;
        }
    };

    const timelineSteps = [
        {
            status: "processing",
            title: "Order Placed",
            description: "Your order has been received and is being processed",
            date: order.createdAt,
            completed: true,
        },
        {
            status: "shipped",
            title: "Order Shipped",
            description: order.trackingNumber
                ? `Tracking: ${order.trackingNumber} (${order.shippingCarrier})`
                : "Your order has been shipped",
            date: order.updatedAt,
            completed: ["shipped", "in_transit", "out_for_delivery", "delivered"].includes(order.deliveryStatus),
        },
        {
            status: "in_transit",
            title: "In Transit",
            description: "Your package is on its way",
            date: null,
            completed: ["in_transit", "out_for_delivery", "delivered"].includes(order.deliveryStatus),
        },
        {
            status: "out_for_delivery",
            title: "Out for Delivery",
            description: "Your package is out for delivery today",
            date: null,
            completed: ["out_for_delivery", "delivered"].includes(order.deliveryStatus),
        },
        {
            status: "delivered",
            title: "Delivered",
            description: "Your order has been delivered",
            date: order.deliveryDate,
            completed: order.deliveryStatus === "delivered",
        },
    ];

    return (
        <Container>
            {timelineSteps.map((step, index) => (
                <TimelineItem key={index} completed={step.completed}>
                    <IconWrapper completed={step.completed}>
                        {getStatusIcon(step.status)}
                    </IconWrapper>
                    <Content>
                        <Title completed={step.completed}>{step.title}</Title>
                        <Description>{step.description}</Description>
                        {step.date && step.completed && (
                            <Date>{new Date(step.date).toLocaleDateString()}</Date>
                        )}
                    </Content>
                </TimelineItem>
            ))}
        </Container>
    );
};

export default OrderTimeline;
