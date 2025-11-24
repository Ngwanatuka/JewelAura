import { useEffect, useState } from "react";
import styled from "styled-components";
import { EmojiEvents, CardGiftcard } from "@material-ui/icons";
import { userRequest } from "../requestMethods";

const Container = styled.div`
  background: linear-gradient(135deg, #d4af37 0%, #c19b2e 100%);
  color: white;
  border-radius: 12px;
  padding: 25px;
  margin: 20px 0;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 20px;
`;

const PointsDisplay = styled.div`
  text-align: center;
  margin: 20px 0;
`;

const Points = styled.div`
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const PointsLabel = styled.div`
  font-size: 14px;
  opacity: 0.9;
`;

const TierBadge = styled.div`
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 1px;
`;

const RewardsSection = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
`;

const RewardItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  opacity: ${props => props.available ? 1 : 0.5};
`;

const RewardName = styled.span`
  font-size: 14px;
`;

const RewardPoints = styled.span`
  font-size: 12px;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 12px;
`;

const ViewAllButton = styled.button`
  width: 100%;
  background: white;
  color: #d4af37;
  border: none;
  padding: 12px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 15px;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const LoyaltyWidget = ({ userId, compact = false }) => {
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoyaltyData = async () => {
      try {
        const response = await userRequest.get(`/loyalty/${userId}`);
        setLoyaltyData(response.data);
      } catch (error) {
        console.error("Failed to fetch loyalty data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchLoyaltyData();
    }
  }, [userId]);

  if (loading || !loyaltyData) {
    return null;
  }

  const topRewards = [
    { name: "R50 Off", points: 500, available: loyaltyData.points >= 500 },
    { name: "R100 Off", points: 1000, available: loyaltyData.points >= 1000 },
    { name: "R250 Off", points: 2500, available: loyaltyData.points >= 2500 },
  ];

  return (
    <Container>
      <Header>
        <EmojiEvents />
        <Title>Loyalty Rewards</Title>
      </Header>

      <PointsDisplay>
        <Points>{loyaltyData.points.toLocaleString()}</Points>
        <PointsLabel>Available Points</PointsLabel>
      </PointsDisplay>

      <div style={{ textAlign: "center" }}>
        <TierBadge>{loyaltyData.tier} Member</TierBadge>
      </div>

      {!compact && (
        <>
          <RewardsSection>
            {topRewards.map((reward, index) => (
              <RewardItem key={index} available={reward.available}>
                <RewardName>
                  <CardGiftcard style={{ fontSize: 16, marginRight: 5, verticalAlign: "middle" }} />
                  {reward.name}
                </RewardName>
                <RewardPoints>{reward.points} pts</RewardPoints>
              </RewardItem>
            ))}
          </RewardsSection>

          <ViewAllButton onClick={() => window.location.href = "/profile"}>
            View All Rewards
          </ViewAllButton>
        </>
      )}
    </Container>
  );
};

export default LoyaltyWidget;
