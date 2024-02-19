import Announcements from "../components/Announcements";
import Navbar from "../components/Navbar";
import styled from "styled-components";
import Slider from "../components/Slider";

const Container = styled.div``;

const Home = () => {
  return (
    <Container>
      <Announcements />
      <Navbar />
      <Slider />
    </Container>
  );
};

export default Home;
