import Announcement from "../components/Announcement";
import Navbar from "../components/Navbar";
import styled from "styled-components";
import Slider from "../components/Slider";
import Categories from "../components/Categories";
import Products from "../components/Products";
import Footer from "../components/Footer";

const Container = styled.div``;

const Home = () => {
  return (
    <Container>
      <Announcement />
      <Navbar />
      <Slider />
      <Categories />
      <Products />
      <Footer />
    </Container>
  );
};

export default Home;
