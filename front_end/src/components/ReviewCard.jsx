import styled from "styled-components";
import { Star, StarBorder } from "@material-ui/icons";

const Card = styled.div`
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Username = styled.span`
  font-weight: 600;
  color: #333;
`;

const Badge = styled.span`
  background: #d4af37;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
`;

const Rating = styled.div`
  display: flex;
  gap: 2px;
  color: #d4af37;
`;

const Comment = styled.p`
  color: #666;
  line-height: 1.6;
  margin: 10px 0;
`;

const Date = styled.span`
  color: #999;
  font-size: 12px;
`;

const HelpfulButton = styled.button`
  background: none;
  border: 1px solid #ddd;
  padding: 5px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  color: #666;
  margin-top: 10px;
  transition: all 0.3s;

  &:hover {
    border-color: #d4af37;
    color: #d4af37;
  }
`;

const ReviewCard = ({ review, onHelpful }) => {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      index < rating ? <Star key={index} /> : <StarBorder key={index} />
    ));
  };

  return (
    <Card>
      <Header>
        <UserInfo>
          <Username>{review.username || "Anonymous"}</Username>
          {review.verifiedPurchase && <Badge>Verified Purchase</Badge>}
        </UserInfo>
        <Rating>{renderStars(review.rating)}</Rating>
      </Header>
      <Comment>{review.comment}</Comment>
      <Date>{new Date(review.createdAt).toLocaleDateString()}</Date>
      {onHelpful && (
        <HelpfulButton onClick={() => onHelpful(review._id)}>
          Helpful ({review.helpful || 0})
        </HelpfulButton>
      )}
    </Card>
  );
};

export default ReviewCard;
