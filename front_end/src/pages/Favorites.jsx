import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Announcement from "../components/Announcement";
import Footer from "../components/Footer";
import { getFavorites, removeFavorite } from "../services/favorites";
import { setFavorites, removeFromFavorites } from "../redux/favoritesRedux";
import { addProduct } from "../redux/cartRedux";
import { FavoriteBorderOutlined, ShoppingCartOutlined } from "@material-ui/icons";

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 50px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-weight: 300;
  text-align: center;
`;

const ProductsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
`;

const ProductCard = styled.div`
  width: 280px;
  background-color: #f5fafd;
  border-radius: 10px;
  padding: 20px;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 10px;
`;

const ProductInfo = styled.div`
  margin-top: 15px;
`;

const ProductTitle = styled.h3`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 10px;
`;

const ProductPrice = styled.p`
  font-size: 20px;
  font-weight: 600;
  color: teal;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const Button = styled.button`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  &:hover {
    opacity: 0.8;
  }
`;

const AddToCartButton = styled(Button)`
  background-color: teal;
  color: white;
`;

const RemoveButton = styled(Button)`
  background-color: #f44336;
  color: white;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: #666;
`;

const Favorites = () => {
  const user = useSelector((state) => state.user.currentUser);
  const favorites = useSelector((state) => state.favorites.products);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        try {
          const data = await getFavorites(user._id, user.accessToken);
          dispatch(setFavorites(data));
        } catch (error) {
          console.error("Error fetching favorites:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFavorites();
  }, [user, dispatch]);

  const handleRemoveFromFavorites = async (productId) => {
    try {
      await removeFavorite(user._id, productId, user.accessToken);
      dispatch(removeFromFavorites(productId));
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addProduct({ ...product.product, quantity: 1 }));
  };

  if (loading) {
    return (
      <Container>
        <Navbar />
        <Announcement />
        <Wrapper>
          <Title>Loading...</Title>
        </Wrapper>
        <Footer />
      </Container>
    );
  }

  return (
    <Container>
      <Navbar />
      <Announcement />
      <Wrapper>
        <Title>My Favorites</Title>
        {favorites.length === 0 ? (
          <EmptyMessage>
            You haven't added any favorites yet. Start browsing our products!
          </EmptyMessage>
        ) : (
          <ProductsContainer>
            {favorites.map((item) => (
              <ProductCard key={item._id}>
                <ProductImage src={item.product?.img} alt={item.product?.title} />
                <ProductInfo>
                  <ProductTitle>{item.product?.title}</ProductTitle>
                  <ProductPrice>R{item.product?.price}</ProductPrice>
                </ProductInfo>
                <ButtonContainer>
                  <AddToCartButton onClick={() => handleAddToCart(item)}>
                    <ShoppingCartOutlined />
                    Add to Cart
                  </AddToCartButton>
                  <RemoveButton onClick={() => handleRemoveFromFavorites(item.productId)}>
                    <FavoriteBorderOutlined />
                    Remove
                  </RemoveButton>
                </ButtonContainer>
              </ProductCard>
            ))}
          </ProductsContainer>
        )}
      </Wrapper>
      <Footer />
    </Container>
  );
};

export default Favorites;
