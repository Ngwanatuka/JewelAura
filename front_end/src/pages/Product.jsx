import styled from "styled-components";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Announcements from "../components/Announcements";

const Container = styled.div``;

const Product = () => {
  return (
    <Container>
      <Announcements />
      <Navbar />
      <Footer />
    </Container>
  );
};

export default Product;
