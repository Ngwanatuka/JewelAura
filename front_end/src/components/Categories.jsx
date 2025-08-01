import styled from "styled-components";
import { categories } from "../data";
import CategoryItem from "./CategoryItem";
import { mobile } from "../responsive";

const Container = styled.div`
  width: 90vw;
  
  margin: 0 auto;
  display: flex;
  padding: 20px;
  justify-content: space-between;
  ${mobile({ 
    width: "100vw", 
    height: "auto", 
    padding: "0px", 
    flexDirection: "column" 
  })}
`;

const Categories = () => {
  return (
    <Container>
      {categories.map((item) => (
        <CategoryItem item={item} key={item.id} />
      ))}
    </Container>
  );
};

export default Categories;
