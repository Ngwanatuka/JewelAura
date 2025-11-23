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
 * @param {string} searchQuery - Search query for products.
 * @param {Object} priceRange - Price range filter with min and max.
 */
const Products = ({ cat, filters, sort, searchQuery, priceRange }) => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        // Build query parameters
        const params = new URLSearchParams();

        if (cat) params.append('category', cat);
        if (searchQuery) params.append('search', searchQuery);
        if (sort) params.append('sort', sort);
        if (priceRange?.min) params.append('minPrice', priceRange.min);
        if (priceRange?.max) params.append('maxPrice', priceRange.max);

        // Add other filters (color, size)
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });

        const queryString = params.toString();
        const url = `http://localhost:5000/api/products${queryString ? `?${queryString}` : ''}`;

        const res = await axios.get(url);
        setProducts(res.data);
      } catch (err) {
        console.log("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, [cat, filters, sort, searchQuery, priceRange]);

  if (loading) {
    return <Container>Loading products...</Container>;
  }

  return (
    <Container>
      {products.length > 0 ? (
        products.map((item) => <Product item={item} key={item._id} />)
      ) : (
        <div>No products found</div>
      )}
    </Container>
  );
};

Products.propTypes = {
  cat: PropTypes.string,
  filters: PropTypes.object,
  sort: PropTypes.string,
  searchQuery: PropTypes.string,
  priceRange: PropTypes.object,
};

export default Products;
