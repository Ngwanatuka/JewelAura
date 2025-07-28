import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
  min-height: 100vh;
`;

const Hero = styled.section`
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Button = styled(Link)`
  padding: 15px 30px;
  background-color: teal;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 1.2rem;
  margin-top: 2rem;
  
  &:hover {
    background-color: rgb(110, 152, 152);
  }
`;

const Section = styled.section`
  padding: 4rem 2rem;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 2rem;
`;

const Landing = () => {
  return (
    <Container>
      <Hero>
        <Title>Welcome to JewelAura</Title>
        <Button to="/products">Shop Now</Button>
      </Hero>
      
      <Section>
        <SectionTitle>Featured Products</SectionTitle>
      </Section>
    </Container>
  );
};

export default Landing;