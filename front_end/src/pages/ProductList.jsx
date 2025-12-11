import styled from "styled-components";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Announcements from "../components/Announcement";
import Products from "../components/Products";
import { useLocation } from "react-router";
import { useState } from "react";
import { Circle, CircleOutlined } from "@mui/icons-material";

const Container = styled.div`
  background: #f8f8f8;
  min-height: 100vh;
`;

const Wrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  gap: 40px;

  @media (max-width: 968px) {
    flex-direction: column;
    padding: 20px 10px;
  }
`;

const Sidebar = styled.div`
  width: 250px;
  min-width: 250px;

  @media (max-width: 968px) {
    width: 100%;
  }
`;

const FilterCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const FilterTitle = styled.h3`
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FilterList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FilterItem = styled.li`
  padding: 8px 0;
  cursor: pointer;
  color: ${props => props.active ? '#d4af37' : '#666'};
  font-size: 14px;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: #d4af37;
  }
`;

const PriceRangeSlider = styled.div`
  padding: 10px 0;
`;

const PriceInputs = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
  width: 100%;
`;

const PriceInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #d4af37;
  }
`;

const PriceLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
  margin-bottom: 5px;
`;

const MainContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const Header = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 28px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 400;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #d4af37;
  }

  &::placeholder {
    color: #999;
  }
`;

const SortSelect = styled.select`
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  background: white;
  min-width: 200px;

  &:focus {
    outline: none;
    border-color: #d4af37;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ResultInfo = styled.div`
  color: #666;
  font-size: 14px;
  margin-top: 15px;
`;

const ProductList = () => {
  const location = useLocation();
  const cat = location.pathname.split("/")[2];
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  const handleFilterClick = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? "" : value
    }));
  };

  const handlePriceChange = (e) => {
    setPriceRange({
      ...priceRange,
      [e.target.name]: e.target.value,
    });
  };

  const categories = [
    { name: "All Categories", value: "" },
    { name: "Rings", value: "rings" },
    { name: "Necklaces", value: "necklaces" },
    { name: "Earrings", value: "earrings" },
    { name: "Bracelets", value: "bracelets" }
  ];

  const materials = [
    { name: "All Materials", value: "" },
    { name: "18k White Gold", value: "White Gold" },
    { name: "18k Yellow Gold", value: "Gold" },
    { name: "14k Yellow Gold", value: "Gold" },
    { name: "Sterling Silver", value: "Silver" }
  ];

  return (
    <Container>
      <Announcements />
      <Navbar />

      <Wrapper>
        <Sidebar>
          <FilterCard>
            <FilterTitle>Category</FilterTitle>
            <FilterList>
              {categories.map(category => (
                <FilterItem
                  key={category.value}
                  active={cat === category.value || (!cat && !category.value)}
                  onClick={() => window.location.href = `/products/${category.value}`}
                >
                  {cat === category.value || (!cat && !category.value) ?
                    <Circle sx={{ fontSize: 12, color: '#d4af37' }} /> :
                    <CircleOutlined sx={{ fontSize: 12, color: '#ccc' }} />
                  }
                  {category.name}
                </FilterItem>
              ))}
            </FilterList>
          </FilterCard>

          <FilterCard>
            <FilterTitle>Material</FilterTitle>
            <FilterList>
              {materials.map(material => (
                <FilterItem
                  key={material.value}
                  active={filters.color === material.value}
                  onClick={() => handleFilterClick('color', material.value)}
                >
                  {filters.color === material.value ?
                    <Circle sx={{ fontSize: 12, color: '#d4af37' }} /> :
                    <CircleOutlined sx={{ fontSize: 12, color: '#ccc' }} />
                  }
                  {material.name}
                </FilterItem>
              ))}
            </FilterList>
          </FilterCard>

          <FilterCard>
            <FilterTitle>Price Range</FilterTitle>
            <PriceRangeSlider>
              <PriceLabel>
                <span>R{priceRange.min || '0.00'}</span>
                <span>R{priceRange.max || '4,000.00'}</span>
              </PriceLabel>
              <PriceInputs>
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
              </PriceInputs>
            </PriceRangeSlider>
          </FilterCard>
        </Sidebar>

        <MainContent>
          <Header>
            <Title>Shop Collection</Title>
            <Subtitle>Explore our curated selection of fine jewelry</Subtitle>

            <TopBar>
              <SearchInput
                type="text"
                placeholder="Search jewelry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <SortSelect value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="newest">Name</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </SortSelect>
            </TopBar>

            <ResultInfo>Showing 6 items</ResultInfo>
          </Header>

          <Products
            cat={cat}
            filters={filters}
            sort={sort}
            searchQuery={searchQuery}
            priceRange={priceRange}
          />
        </MainContent>
      </Wrapper>

      <Footer />
    </Container>
  );
};

export default ProductList;
