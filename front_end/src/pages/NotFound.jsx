import styled from "styled-components";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: #fafafa;
`;

const Code = styled.h1`
  font-size: 72px;
  font-weight: 700;
  color: teal;
  margin-bottom: 8px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 500;
  color: #222;
  margin-bottom: 12px;
`;

const Text = styled.p`
  font-size: 15px;
  color: #666;
  max-width: 420px;
  margin-bottom: 28px;
  line-height: 1.5;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`;

const StyledLink = styled(Link)`
  padding: 12px 24px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  background: ${(props) => (props.$outline ? "transparent" : "teal")};
  color: ${(props) => (props.$outline ? "teal" : "#fff")};
  border: 1px solid teal;
`;

const NotFound = () => {
  return (
    <Container>
      <Navbar />
      <Main>
        <Code>404</Code>
        <Title>Page Not Found</Title>
        <Text>
          The page you are looking for might have been moved, removed, or does not exist.
        </Text>
        <Actions>
          <StyledLink to="/">Back to Home</StyledLink>
          <StyledLink to="/products" $outline>
            Browse Jewelry
          </StyledLink>
        </Actions>
      </Main>
      <Footer />
    </Container>
  );
};

export default NotFound;
