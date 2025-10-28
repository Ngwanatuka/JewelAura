// Product.jsx
import {
  FavoriteBorderOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@material-ui/icons";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../redux/cartRedux";
import { useNavigate } from "react-router-dom";

const Info = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  z-index: 3;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.5s ease;
  cursor: pointer;
`;

const Circle = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  position: absolute;
`;

const Container = styled.div`
  flex: 1 0 280px;
  margin: 5px;
  min-width: 280px;
  max-width: 320px;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5fafd;
  position: relative;
  border-radius: 10px;

  &:hover ${Info} {
    opacity: 1;
    border-radius: 10px;
    transform: translateY(-5px);
    transition: all 0.3s ease;
    cursor: pointer;
  }
  &:hover ${Circle} {
    background-color: #e9f5f5;
    transition: all 0.5s ease;
  }
`;



const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 2;
  border-radius: 10px;
`;

const Icon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  transition: all 0.5s ease;
  cursor: pointer;
  &:hover {
    background-color: #e9f5f5;
    transform: scale(1.1);
  }
`;

/**
 * A Product component, which displays a product item in a list,
 * along with its image, and three icons: a shopping cart, a search
 * icon, and a favorite border icon.
 *
 * @param {Object} item - The product item to be displayed.
 * @param {string} item.img - The image of the product.
 * @param {string} item._id - The id of the product.
 *
 * @returns {React.ReactElement} - The Product component.
 */
const Product = ({ item }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.currentUser);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(addProduct({ ...item, quantity: 1 }));
  };

  const handleAddToFavorites = () => {
    console.log('Added to favorites:', item.title);
  };

  return (
    <Container>
      <Circle />
      <Image src={item.img} />
      <Info>
        <Icon onClick={handleAddToCart} data-testid="add-to-cart">
          <ShoppingCartOutlined />
        </Icon>
        <Icon>
          <Link to={`/product/${item._id}`} style={{color: "black"}}>
            <SearchOutlined />
          </Link>
        </Icon>
        <Icon onClick={handleAddToFavorites}>
          <FavoriteBorderOutlined />
        </Icon>
      </Info>
    </Container>
  );
};

export default Product;