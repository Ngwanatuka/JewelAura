import styled from "styled-components";
import Product from "./Product";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from "axios";
import { mobile } from "../responsive";

const Container = styled.div`
  width: 90vw;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  ${mobile({ width: "100vw", padding: "10px" })}
`;

/**
 * Component that renders a list of products based on the category, filters and sort criteria specified in the props.
 *
 * @param {string} cat - The category of products to be rendered.
 * @param {Object} filters - A dictionary of filters to be applied to the products.
 * @param {string} sort - The criteria to sort the products by.
 */
const Products = ({ cat, filters, sort }) => {

  console.log(cat, filters, sort);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(
          cat
            ? `http://localhost:5000/api/products?category=${cat}`
            : "http://localhost:5000/api/products"
        );
        console.log("Products fetched:", res.data);
        setProducts(res.data);
      } catch (err) {
        console.log("Error fetching products:", err);
      }
    };
    getProducts();
  }, [cat]);

  useEffect(() => {
    cat &&
      setFilteredProducts(
        products.filter((item) =>
          Object.entries(filters).every(([key, value]) =>
            item[key].includes(value)
          )
        )
      );
  }, [products, cat, filters]);

  useEffect(() => {
    if (sort === "newest") {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => a.createdAt - b.createdAt)
      );
    } else if (sort === "asc") {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => a.price - b.price)
      );
    } else {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => b.price - a.price)
      );
    }
  }, [sort]);

  return (
    <Container>
      {cat
        ? filteredProducts.map((item) => <Product item={item} key={item._id} />)
        : products
            .slice(0, 8)
            .map((item) => <Product item={item} key={item._id} />)}
    </Container>
  );
};

Products.propTypes = {
  cat: PropTypes.string,
  filters: PropTypes.object,
  sort: PropTypes.string,
};

export default Products;
