import Announcements from "../components/Announcements";
import Navbar from "../components/Navbar";
import styled from "styled-components";
import Slider from "../components/Slider";
import Categories from "../components/Categories";
import Products from "../components/Products";
import Newsletter from "../components/Newsletter";

const Container = styled.div``;

const Home = () => {
  return (
    <Container>
      <Announcements />
      <Navbar />
      <Slider />
      <Categories />
      <Products />
      <Newsletter />
    </Container>
  );
};

export default Home;
