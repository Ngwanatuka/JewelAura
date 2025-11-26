import styled from "styled-components";
import { useEffect, useState } from "react";
import { getIncome, getStats } from "../../services/admin";
import { LineStyle, TrendingUp, AttachMoney, ShoppingCart } from "@material-ui/icons";

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ChartSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  margin-bottom: 20px;
`;

const ChartTitle = styled.h3`
  margin-bottom: 15px;
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
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #eee;
`;

const Analytics = () => {
    const [income, setIncome] = useState([]);
    const [userStats, setUserStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [incomeData, statsData] = await Promise.all([
                    getIncome(),
                    getStats()
                ]);
                setIncome(incomeData);
                setUserStats(statsData);
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const totalRevenue = income.reduce((sum, item) => sum + (item.total || 0), 0);
    const currentMonthRevenue = income[0]?.total || 0;
    const totalUsers = userStats.reduce((sum, item) => sum + (item.total || 0), 0);

    if (loading) {
        return <Container>Loading analytics...</Container>;
    }

    return (
        <Container>
            <Title>Analytics Dashboard</Title>

            <StatsGrid>
                <StatCard>
                    <StatTitle>Total Revenue</StatTitle>
                    <StatValue>
                        <AttachMoney style={{ color: "#00a9e0" }} />
                        R{totalRevenue}
                    </StatValue>
                </StatCard>

                <StatCard>
                    <StatTitle>Current Month</StatTitle>
                    <StatValue>
                        <TrendingUp style={{ color: "#4caf50" }} />
                        R{currentMonthRevenue}
                    </StatValue>
                </StatCard>

                <StatCard>
                    <StatTitle>Total Users</StatTitle>
                    <StatValue>
                        <LineStyle style={{ color: "#ff9800" }} />
                        {totalUsers}
                    </StatValue>
                </StatCard>
            </StatsGrid>

            <ChartSection>
                <ChartTitle>Monthly Revenue</ChartTitle>
                <Table>
                    <thead>
                        <tr>
                            <Th>Month</Th>
                            <Th>Revenue (ZAR)</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {income.map((item, index) => (
                            <tr key={index}>
                                <Td>Month {item._id}</Td>
                                <Td>R{item.total}</Td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </ChartSection>

            <ChartSection>
                <ChartTitle>User Growth</ChartTitle>
                <Table>
                    <thead>
                        <tr>
                            <Th>Month</Th>
                            <Th>New Users</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {userStats.map((item, index) => (
                            <tr key={index}>
                                <Td>Month {item._id}</Td>
                                <Td>{item.total}</Td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </ChartSection>
        </Container>
    );
};

export default Analytics;
