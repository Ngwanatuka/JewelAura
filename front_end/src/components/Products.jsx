import styled from "styled-components";
import { popularProducts } from "../data";
import Product from "./Product";
import PropTypes from "prop-types";

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Products = ({cat, filters, sort}) => {
  console.log(cat, filters, sort);
  return (
    <Container>
      {popularProducts.map((item) => (
        <Product item={item} key={item.id} />
      ))}
    </Container>
  );
};

Products.propTypes = {
  cat: PropTypes.string,
  filters: PropTypes.object,
  sort: PropTypes.string,
};

export default Products;
