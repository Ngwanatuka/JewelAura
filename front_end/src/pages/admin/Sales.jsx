import styled from "styled-components";
import { useEffect, useState } from "react";
import { getOrders } from "../../services/admin";
import { TrendingUp, ShoppingCart, CheckCircle, HourglassEmpty } from "@material-ui/icons";

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  background: white;
`;

const StatTitle = styled.h3`
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TableSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  border-bottom: 2px solid #ddd;
  color: #666;
  font-size: 14px;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${props =>
        props.status === 'completed' ? '#4caf50' :
            props.status === 'pending' ? '#ff9800' : '#666'
    };
  color: white;
`;

const Sales = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getOrders();
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const totalSales = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;

    if (loading) {
        return <Container>Loading sales data...</Container>;
    }

    return (
        <Container>
            <Title>Sales Overview</Title>

            <StatsGrid>
                <StatCard>
                    <StatTitle>Total Sales</StatTitle>
                    <StatValue>
                        <TrendingUp style={{ color: "#00a9e0" }} />
                        R{totalSales}
                    </StatValue>
                </StatCard>

                <StatCard>
                    <StatTitle>Total Orders</StatTitle>
                    <StatValue>
                        <ShoppingCart style={{ color: "#9c27b0" }} />
                        {orders.length}
                    </StatValue>
                </StatCard>

                <StatCard>
                    <StatTitle>Completed</StatTitle>
                    <StatValue>
                        <CheckCircle style={{ color: "#4caf50" }} />
                        {completedOrders}
                    </StatValue>
                </StatCard>

                <StatCard>
                    <StatTitle>Pending</StatTitle>
                    <StatValue>
                        <HourglassEmpty style={{ color: "#ff9800" }} />
                        {pendingOrders}
                    </StatValue>
                </StatCard>
            </StatsGrid>

            <TableSection>
                <h3 style={{ marginBottom: "15px" }}>Recent Orders</h3>
                <Table>
                    <thead>
                        <tr>
                            <Th>Order ID</Th>
                            <Th>Amount</Th>
                            <Th>Status</Th>
                            <Th>Items</Th>
                            <Th>Date</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.slice(0, 10).map((order) => (
                            <tr key={order._id}>
                                <Td>{order._id.slice(-8).toUpperCase()}</Td>
                                <Td>R{order.amount}</Td>
                                <Td>
                                    <StatusBadge status={order.status}>
                                        {order.status}
                                    </StatusBadge>
                                </Td>
                                <Td>{order.products?.length || 0}</Td>
                                <Td>{new Date(order.createdAt).toLocaleDateString()}</Td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </TableSection>
        </Container>
    );
};

export default Sales;
