import styled from "styled-components";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Announcements from "../components/Announcement";
import Products from "../components/Products";
import Newsletter from "../components/Newsletter";
import { useLocation } from "react-router";
import { useState } from "react";


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

const Select = styled.select`
  padding: 10px;
  margin-right: 20px;
  cursor: pointer;
`;

const Option = styled.option``;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px;
`;

const SearchInput = styled.input`
  width: 50%;
  padding: 12px 20px;
  border: 2px solid #ddd;
  border-radius: 25px;
  font-size: 16px;
  outline: none;

  &:focus {
    border-color: teal;
  }
`;

const PriceInput = styled.input`
  width: 80px;
  padding: 8px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;

  &:focus {
    border-color: teal;
  }
`;

const ProductList = () => {
  const location = useLocation();
  const cat = location.pathname.split("/")[2];
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  const handleFilters = (e) => {
    const value = e.target.value;
    setFilters({
      ...filters,
      [e.target.name]: value,
    });
  };

  const handlePriceChange = (e) => {
    setPriceRange({
      ...priceRange,
      [e.target.name]: e.target.value,
    });
  };


  return (
    <Container>
      <Announcements />
      <Navbar />
      <Tittle>{cat || "All Products"}</Tittle>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchContainer>
      <FilterContainer>
        <Filter>
          <FilterText>Filter Products:</FilterText>
          <Select name="color" onChange={handleFilters}>
            <Option disabled>Color</Option>
            <Option value="Gold">Gold</Option>
            <Option value="Black">Black</Option>
            <Option value="Silver">Silver</Option>
            <Option value="Green">Green</Option>
            <Option value="Yellow">Yellow</Option>

          </Select>
          <Select name="size" onChange={handleFilters}>
            <Option disabled>Size</Option>
            <Option value="small">Small</Option>
            <Option value="medium">Medium</Option>
            <Option value="large">Large</Option>
          </Select>
          <FilterText>Price Range:</FilterText>
          <PriceInput
            type="number"
            name="min"
            placeholder="Min"
            value={priceRange.min}
            onChange={handlePriceChange}
          />
          <PriceInput
            type="number"
            name="max"
            placeholder="Max"
            value={priceRange.max}
            onChange={handlePriceChange}
          />
        </Filter>
        <Filter>
          <FilterText>Sort Products:</FilterText>
          <Select onChange={(e) => setSort(e.target.value)}>
            <Option value="newest">Newest</Option>
            <Option value="price-asc">Price (Low to High)</Option>
            <Option value="price-desc">Price (High to Low)</Option>
          </Select>
        </Filter>
      </FilterContainer>
      <Products cat={cat} filters={filters} sort={sort} searchQuery={searchQuery} priceRange={priceRange} />
      <Newsletter />
      <Footer />
    </Container>
  );
};

export default ProductList;
