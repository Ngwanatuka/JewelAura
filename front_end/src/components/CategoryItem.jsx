import styled from "styled-components";
import PropTypes from "prop-types";
import { mobile } from "../responsive";
import { Link } from "react-router-dom";

const Container = styled.div`
  flex: 1;
  margin: 3px;
  height: 30vh;
  position: relative;
  &:hover {
    transform: translateY(-5px);
    transition: all 0.3s ease;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  ${mobile({ height: "30vh" })}
`;

const Info = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

`;

const Title = styled.h1`
  color: white;
  margin-bottom: 20px;

`;

const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 20px;
  background-color:rgb(54, 132, 132);
  color: white;
  cursor: pointer;
  margin-bottom: 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color:rgb(110, 152, 152);
    
  }
  &:disabled {
    background-color: #9e9e9e;
    cursor: not-allowed;
  }
`;

const CategoryItem = ({ item }) => {
  return (
    <Container>
    <Link to={`/products/${item.cat}`}>
      <Image src={item.img} />
      <Info>
        <Title>{item.title}</Title>
        <Button>SHOP NOW</Button>
      </Info>
    </Link>
    </Container>
  );
};

CategoryItem.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    cat: PropTypes.string.isRequired,
  }).isRequired,
};

export default CategoryItem;
