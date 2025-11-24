import { useState } from "react";
import styled from "styled-components";
import { Star, StarBorder } from "@material-ui/icons";

const Container = styled.div`
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 25px;
  margin-top: 20px;
`;

const Title = styled.h3`
  margin: 0 0 20px 0;
  color: #333;
`;

const RatingSelector = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
`;

const RatingLabel = styled.span`
  color: #666;
  font-weight: 500;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.filled ? "#d4af37" : "#ddd"};
  padding: 0;
  font-size: 24px;
  transition: color 0.2s;

  &:hover {
    color: #d4af37;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  margin-bottom: 15px;

  &:focus {
    outline: none;
    border-color: #d4af37;
  }
`;

const SubmitButton = styled.button`
  background: #d4af37;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;

  &:hover {
    background: #c19b2e;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const Message = styled.p`
  color: ${props => props.error ? "#e74c3c" : "#27ae60"};
  margin-top: 10px;
  font-size: 14px;
`;

const ReviewForm = ({ productId, orderId, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", error: false });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setMessage({ text: "Please select a rating", error: true });
      return;
    }

    if (comment.trim().length < 10) {
      setMessage({ text: "Review must be at least 10 characters", error: true });
      return;
    }

    setLoading(true);
    setMessage({ text: "", error: false });

    try {
      await onSubmit({ productId, orderId, rating, comment });
      setMessage({ text: "Review submitted successfully!", error: false });
      setRating(0);
      setComment("");
    } catch (error) {
      setMessage({
        text: error.response?.data || "Failed to submit review",
        error: true
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Write a Review</Title>
      <form onSubmit={handleSubmit}>
        <RatingSelector>
          <RatingLabel>Your Rating:</RatingLabel>
          {[1, 2, 3, 4, 5].map((star) => (
            <StarButton
              key={star}
              type="button"
              filled={star <= (hoveredRating || rating)}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
            >
              {star <= (hoveredRating || rating) ? <Star /> : <StarBorder />}
            </StarButton>
          ))}
        </RatingSelector>

        <Textarea
          placeholder="Share your experience with this product..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={1000}
        />

        <SubmitButton type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Review"}
        </SubmitButton>

        {message.text && (
          <Message error={message.error}>{message.text}</Message>
        )}
      </form>
    </Container>
  );
};

export default ReviewForm;
