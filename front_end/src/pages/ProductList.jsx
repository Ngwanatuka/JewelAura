import styled from "styled-components";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Announcements from "../components/Announcement";
import Products from "../components/Products";
import Newsletter from "../components/Newsletter";
import { useLocation } from "react-router";
import { useState } from "react";
import { Close, FilterList } from "@material-ui/icons";

const Container = styled.div``;

const Wrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  gap: 30px;
  position: relative;
  overflow-x: hidden;

  @media (max-width: 968px) {
    padding: 10px;
  }
`;

const FilterSidebar = styled.div`
  width: 280px;
  min-width: 280px;
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  height: fit-content;
  position: sticky;
  top: 20px;

  @media (max-width: 968px) {
    position: fixed;
    left: ${props => props.isOpen ? '0' : '-100%'};
    top: 0;
    height: 100vh;
    z-index: 1000;
    transition: left 0.3s ease;
    overflow-y: auto;
    min-width: 280px;
  }
`;

const Overlay = styled.div`
  display: none;

  @media (max-width: 968px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
`;

const MobileFilterButton = styled.button`
  display: none;
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: linear-gradient(135deg, #d4af37 0%, #c19b2e 100%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
  cursor: pointer;
  z-index: 998;
  align-items: center;
  justify-content: center;

  @media (max-width: 968px) {
    display: flex;
  }
`;

const CloseButton = styled.button`
  display: none;
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;

  @media (max-width: 968px) {
    display: block;
  }
`;

const MainContent = styled.div`
  flex: 1;
  min-width: 0;
  overflow: hidden;

  @media (max-width: 968px) {
    width: 100%;
  }
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 32px;
  color: #333;
  margin-bottom: 10px;
  text-transform: capitalize;
`;

const ResultCount = styled.p`
  color: #666;
  font-size: 14px;
`;

const SearchBox = styled.div`
  margin-bottom: 30px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 14px 20px;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #d4af37;
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 25px;
  padding-bottom: 25px;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const FilterTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FilterOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FilterButton = styled.button`
  padding: 10px 16px;
  border: 2px solid ${props => props.active ? '#d4af37' : '#eee'};
  background: ${props => props.active ? '#fff9e6' : 'white'};
  color: ${props => props.active ? '#d4af37' : '#666'};
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: ${props => props.active ? '600' : '400'};
  transition: all 0.2s;
  text-align: left;

  &:hover {
    border-color: #d4af37;
    background: #fff9e6;
  }
`;

const PriceInputs = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const PriceInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 2px solid #eee;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #d4af37;
  }
`;

const PriceSeparator = styled.span`
  color: #999;
  font-weight: 600;
`;

const SortSection = styled.div`
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const SortLabel = styled.label`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  display: block;
`;

const SortSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 2px solid #eee;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  background: white;

  &:focus {
    outline: none;
    border-color: #d4af37;
  }
`;

const ClearButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #f5f5f5;
  border: none;
  border-radius: 6px;
  color: #666;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e0e0e0;
  }
`;

const ProductList = () => {
  const location = useLocation();
  const cat = location.pathname.split("/")[2];
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const clearAllFilters = () => {
    setFilters({});
    setSearchQuery("");
    setPriceRange({ min: "", max: "" });
    setSort("newest");
  };

  const colors = ["Gold", "Silver", "Black", "Rose Gold", "White Gold"];
  const sizes = ["Small", "Medium", "Large", "XL"];

  return (
    <Container>
      <Announcements />
      <Navbar />

      <Wrapper>
        <Overlay isOpen={isSidebarOpen} onClick={() => setIsSidebarOpen(false)} />

        <FilterSidebar isOpen={isSidebarOpen}>
          <CloseButton onClick={() => setIsSidebarOpen(false)}>
            <Close />
          </CloseButton>

          <FilterTitle>Search</FilterTitle>
          <SearchBox>
            <SearchInput
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBox>

          <FilterSection>
            <FilterTitle>Color</FilterTitle>
            <FilterOptions>
              {colors.map(color => (
                <FilterButton
                  key={color}
                  active={filters.color === color}
                  onClick={() => handleFilterClick('color', color)}
                >
                  {color}
                </FilterButton>
              ))}
            </FilterOptions>
          </FilterSection>

          <FilterSection>
            <FilterTitle>Size</FilterTitle>
            <FilterOptions>
              {sizes.map(size => (
                <FilterButton
                  key={size}
                  active={filters.size === size}
                  onClick={() => handleFilterClick('size', size)}
                >
                  {size}
                </FilterButton>
              ))}
            </FilterOptions>
          </FilterSection>

          <FilterSection>
            <FilterTitle>Price Range (ZAR)</FilterTitle>
            <PriceInputs>
              <PriceInput
                type="number"
                name="min"
                placeholder="Min"
                value={priceRange.min}
                onChange={handlePriceChange}
              />
              <PriceSeparator>-</PriceSeparator>
              <PriceInput
                type="number"
                name="max"
                placeholder="Max"
                value={priceRange.max}
                onChange={handlePriceChange}
              />
            </PriceInputs>
          </FilterSection>

          <ClearButton onClick={clearAllFilters}>
            Clear All Filters
          </ClearButton>
        </FilterSidebar>

        <MainContent>
          <Header>
            <Title>{cat || "All Products"}</Title>
            <ResultCount>Showing all available products</ResultCount>
          </Header>

          <SortSection>
            <SortLabel>Sort by:</SortLabel>
            <SortSelect value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </SortSelect>
          </SortSection>

          <Products
            cat={cat}
            filters={filters}
            sort={sort}
            searchQuery={searchQuery}
            priceRange={priceRange}
          />
        </MainContent>

        <MobileFilterButton onClick={() => setIsSidebarOpen(true)}>
          <FilterList />
        </MobileFilterButton>
      </Wrapper>

      <Newsletter />
      <Footer />
    </Container>
  );
};

export default ProductList;
