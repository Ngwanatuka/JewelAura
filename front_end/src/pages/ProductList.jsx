import styled from "styled-components";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Announcements from "../components/Announcements";
import Products from "../components/Products";
import Newsletter from "../components/Newsletter";

const Container = styled.div``;

const Tittle = styled.h1`
  margin: 20px;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Filter = styled.div`
  margin: 20px;
`;

const FilterText = styled.span`
  font-size: 20px;

  margin-right: 20px;
`;

const ProductList = () => {
  return (
    <Container>
      <Announcements />
      <Navbar />
      <Tittle>Rings</Tittle>
      <FilterContainer>
        <Filter>
          <FilterText>Filter Products:</FilterText>
        </Filter>
        <Filter>
          <FilterText>Sort Products:</FilterText>
        </Filter>
      </FilterContainer>
      <Products />
      <Newsletter />
      <Footer />
    </Container>
  );
};

export default ProductList;
