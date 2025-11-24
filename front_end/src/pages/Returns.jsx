import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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

const Section = styled.div`
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
`;

const ReturnsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ReturnCard = styled.div`
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 20px;
  background: #f9f9f9;
`;

const ReturnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const ReturnId = styled.span`
  font-weight: 600;
  color: #333;
`;

const StatusBadge = styled.span`
  background: ${props => {
        switch (props.status) {
            case "approved": return "#27ae60";
            case "rejected": return "#e74c3c";
            case "refunded": return "#3498db";
            default: return "#f39c12";
        }
    }};
  color: white;
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
`;

const ReturnInfo = styled.div`
  color: #666;
  font-size: 14px;
  margin: 5px 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #d4af37;
  }
`;

const Textarea = styled.textarea`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #d4af37;
  }
`;

const Button = styled.button`
  background: #d4af37;
  color: white;
  border: none;
  padding: 14px 30px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s;
  align-self: flex-start;

  &:hover {
    background: #c19b2e;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  padding: 15px;
  border-radius: 4px;
  background: ${props => props.error ? "#fee" : "#efe"};
  color: ${props => props.error ? "#c33" : "#383"};
  margin-bottom: 20px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #999;
`;

const Returns = () => {
    const user = useSelector((state) => state.user.currentUser);
    const [returns, setReturns] = useState([]);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState("");
    const [returnReason, setReturnReason] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", error: false });

    useEffect(() => {
        fetchReturns();
        fetchOrders();
    }, []);

    const fetchReturns = async () => {
        try {
            const response = await userRequest.get(`/returns/user/${user._id}`);
            setReturns(response.data);
        } catch (error) {
            console.error("Failed to fetch returns:", error);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await userRequest.get(`/orders/find/${user._id}`);
            // Filter completed orders from last 30 days
            const eligibleOrders = response.data.filter(order => {
                const orderDate = new Date(order.createdAt);
                const daysSince = Math.floor((Date.now() - orderDate) / (1000 * 60 * 60 * 24));
                return order.status === "completed" && daysSince <= 30;
            });
            setOrders(eligibleOrders);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedOrder || !returnReason) {
            setMessage({ text: "Please fill in all required fields", error: true });
            return;
        }

        setLoading(true);
        setMessage({ text: "", error: false });

        try {
            const order = orders.find(o => o._id === selectedOrder);

            await userRequest.post("/returns", {
                orderId: selectedOrder,
                products: order.products,
                returnReason,
                description,
            });

            setMessage({ text: "Return request submitted successfully!", error: false });
            setSelectedOrder("");
            setReturnReason("");
            setDescription("");
            fetchReturns();
        } catch (error) {
            setMessage({
                text: error.response?.data || "Failed to submit return request",
                error: true
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Navbar />
            <Wrapper>
                <Title>Returns & Refunds</Title>

                <Section>
                    <SectionTitle>Request a Return</SectionTitle>

                    {message.text && (
                        <Message error={message.error}>{message.text}</Message>
                    )}

                    {orders.length === 0 ? (
                        <EmptyState>No eligible orders for return</EmptyState>
                    ) : (
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label>Select Order *</Label>
                                <Select
                                    value={selectedOrder}
                                    onChange={(e) => setSelectedOrder(e.target.value)}
                                    required
                                >
                                    <option value="">Choose an order...</option>
                                    {orders.map((order) => (
                                        <option key={order._id} value={order._id}>
                                            Order #{order._id.slice(-8).toUpperCase()} - $
                                            {order.amount.toFixed(2)} ({new Date(order.createdAt).toLocaleDateString()})
                                        </option>
                                    ))}
                                </Select>
                            </FormGroup>

                            <FormGroup>
                                <Label>Reason for Return *</Label>
                                <Select
                                    value={returnReason}
                                    onChange={(e) => setReturnReason(e.target.value)}
                                    required
                                >
                                    <option value="">Select a reason...</option>
                                    <option value="defective">Defective or damaged</option>
                                    <option value="wrong_item">Wrong item received</option>
                                    <option value="not_as_described">Not as described</option>
                                    <option value="changed_mind">Changed my mind</option>
                                    <option value="size_issue">Size issue</option>
                                    <option value="other">Other</option>
                                </Select>
                            </FormGroup>

                            <FormGroup>
                                <Label>Additional Details</Label>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Please provide any additional information about your return..."
                                    maxLength={500}
                                />
                            </FormGroup>

                            <Button type="submit" disabled={loading}>
                                {loading ? "Submitting..." : "Submit Return Request"}
                            </Button>
                        </Form>
                    )}
                </Section>

                <Section>
                    <SectionTitle>Your Return Requests</SectionTitle>

                    {returns.length === 0 ? (
                        <EmptyState>No return requests yet</EmptyState>
                    ) : (
                        <ReturnsList>
                            {returns.map((returnItem) => (
                                <ReturnCard key={returnItem._id}>
                                    <ReturnHeader>
                                        <ReturnId>
                                            Return #{returnItem._id.slice(-8).toUpperCase()}
                                        </ReturnId>
                                        <StatusBadge status={returnItem.status}>
                                            {returnItem.status}
                                        </StatusBadge>
                                    </ReturnHeader>
                                    <ReturnInfo>
                                        <strong>Order:</strong> #{returnItem.orderId.slice(-8).toUpperCase()}
                                    </ReturnInfo>
                                    <ReturnInfo>
                                        <strong>Reason:</strong> {returnItem.returnReason.replace("_", " ")}
                                    </ReturnInfo>
                                    <ReturnInfo>
                                        <strong>Requested:</strong> {new Date(returnItem.createdAt).toLocaleDateString()}
                                    </ReturnInfo>
                                    {returnItem.refundAmount && (
                                        <ReturnInfo>
                                            <strong>Refund Amount:</strong> ${returnItem.refundAmount.toFixed(2)}
                                        </ReturnInfo>
                                    )}
                                    {returnItem.adminNotes && (
                                        <ReturnInfo style={{ marginTop: 10, fontStyle: "italic" }}>
                                            <strong>Admin Note:</strong> {returnItem.adminNotes}
                                        </ReturnInfo>
                                    )}
                                </ReturnCard>
                            ))}
                        </ReturnsList>
                    )}
                </Section>
            </Wrapper>
            <Footer />
        </Container>
    );
};

export default Returns;
