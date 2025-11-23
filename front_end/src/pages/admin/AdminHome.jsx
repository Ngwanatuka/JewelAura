import styled from "styled-components";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";
import { useEffect, useState, useMemo } from "react";
import { getStats, getIncome } from "../../services/admin";

const Container = styled.div`
  padding: 20px;
`;

const Featured = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const FeaturedItem = styled.div`
  flex: 1;
  margin: 0px 20px;
  padding: 30px;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
`;

const FeaturedTitle = styled.span`
  font-size: 20px;
`;

const FeaturedMoneyContainer = styled.div`
  margin: 10px 0px;
  display: flex;
  align-items: center;
`;

const FeaturedMoney = styled.span`
  font-size: 30px;
  font-weight: 600;
`;

const FeaturedMoneyRate = styled.span`
  display: flex;
  align-items: center;
  margin-left: 20px;
`;

const FeaturedSub = styled.span`
  font-size: 15px;
  color: gray;
`;

const AdminHome = () => {
    const [userStats, setUserStats] = useState([]);
    const [income, setIncome] = useState([]);
    const [perc, setPerc] = useState(0);

    const MONTHS = useMemo(
        () => [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ],
        []
    );

    useEffect(() => {
        const getStatsData = async () => {
            try {
                const res = await getStats();
                res.map((item) =>
                    setUserStats((prev) => [
                        ...prev,
                        { name: MONTHS[item._id - 1], "Active User": item.total },
                    ])
                );
            } catch { }
        };
        getStatsData();
    }, [MONTHS]);

    useEffect(() => {
        const getIncomeData = async () => {
            try {
                const res = await getIncome();
                setIncome(res);
                if (res.length > 1) {
                    setPerc((res[1].total * 100) / res[0].total - 100);
                }
            } catch { }
        };
        getIncomeData();
    }, []);

    return (
        <Container>
            <Featured>
                <FeaturedItem>
                    <FeaturedTitle>Revenue</FeaturedTitle>
                    <FeaturedMoneyContainer>
                        <FeaturedMoney>${income[1]?.total || 0}</FeaturedMoney>
                        <FeaturedMoneyRate>
                            %{Math.floor(perc)}{" "}
                            {perc < 0 ? (
                                <ArrowDownward style={{ fontSize: "14px", color: "red" }} />
                            ) : (
                                <ArrowUpward style={{ fontSize: "14px", color: "green" }} />
                            )}
                        </FeaturedMoneyRate>
                    </FeaturedMoneyContainer>
                    <FeaturedSub>Compared to last month</FeaturedSub>
                </FeaturedItem>
                <FeaturedItem>
                    <FeaturedTitle>Sales</FeaturedTitle>
                    <FeaturedMoneyContainer>
                        <FeaturedMoney>$4,415</FeaturedMoney>
                        <FeaturedMoneyRate>
                            -1.4 <ArrowDownward style={{ fontSize: "14px", color: "red" }} />
                        </FeaturedMoneyRate>
                    </FeaturedMoneyContainer>
                    <FeaturedSub>Compared to last month</FeaturedSub>
                </FeaturedItem>
                <FeaturedItem>
                    <FeaturedTitle>Cost</FeaturedTitle>
                    <FeaturedMoneyContainer>
                        <FeaturedMoney>$2,225</FeaturedMoney>
                        <FeaturedMoneyRate>
                            +2.4 <ArrowUpward style={{ fontSize: "14px", color: "green" }} />
                        </FeaturedMoneyRate>
                    </FeaturedMoneyContainer>
                    <FeaturedSub>Compared to last month</FeaturedSub>
                </FeaturedItem>
            </Featured>
            {/* Chart component could go here */}
        </Container>
    );
};

export default AdminHome;
