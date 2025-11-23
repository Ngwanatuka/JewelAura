import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { mobile } from '../responsive';

const Container = styled.div`
  min-height: 100vh;
  background-color: var(--bg-main);
`;

const Hero = styled.section`
  height: 85vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
              url("https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80") center/cover no-repeat;
  color: white;
  text-align: center;
  ${mobile({ height: "60vh" })}
`;

const Title = styled.h1`
  font-size: 4.5rem;
  margin-bottom: 1rem;
  font-family: var(--font-heading);
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  ${mobile({ fontSize: "2.5rem" })}
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  font-weight: 300;
  letter-spacing: 1px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
  ${mobile({ fontSize: "1rem", padding: "0 20px" })}
`;

const Button = styled(Link)`
  padding: 15px 40px;
  background-color: var(--primary);
  color: white;
  text-decoration: none;
  border-radius: 30px;
  font-size: 1.2rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-lg);
  
  &:hover {
    background-color: white;
    color: var(--primary);
    transform: translateY(-2px);
  }
`;

const Section = styled.section`
  padding: 6rem 2rem;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: var(--text-main);
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background-color: var(--secondary);
  }
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const CategoryCard = styled.div`
  position: relative;
  height: 350px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: transform 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-lg);
  }
`;

const CategoryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  ${CategoryCard}:hover & {
    transform: scale(1.1);
  }
`;

const CategoryOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem;
  align-items: center;
`;

const CategoryTitle = styled.h3`
  font-size: 1.8rem;
  color: white;
  margin-bottom: 1rem;
`;

const CategoryLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 8px 20px;
  border: 1px solid white;
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: white;
    color: var(--text-main);
  }
`;

const WhyChooseSection = styled(Section)`
  background-color: var(--primary-light);
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Benefit = styled.div`
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const BenefitIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const BenefitTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: var(--primary);
`;

const BenefitText = styled.p`
  color: var(--text-light);
  line-height: 1.6;
`;

const TestimonialsSection = styled(Section)``;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Testimonial = styled.div`
  background-color: white;
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: var(--shadow-md);
  text-align: left;
  position: relative;
  
  &:before {
    content: '"';
    font-size: 4rem;
    color: var(--primary-light);
    position: absolute;
    top: 10px;
    left: 20px;
    font-family: serif;
  }
`;

const TestimonialText = styled.p`
  font-style: italic;
  color: var(--text-main);
  margin-bottom: 1.5rem;
  line-height: 1.6;
  position: relative;
  z-index: 1;
`;

const TestimonialAuthor = styled.p`
  color: var(--primary);
  font-weight: 600;
  display: flex;
  align-items: center;
  
  &:before {
    content: '';
    width: 20px;
    height: 2px;
    background-color: var(--secondary);
    margin-right: 10px;
  }
`;

const Landing = () => {
  return (
    <Container>
      <Hero>
        <Title>Welcome to JewelAura</Title>
        <Subtitle>
          Discover Timeless Elegance in Every Piece
        </Subtitle>
        <Button to="/products">Shop Collection</Button>
      </Hero>

      <Section>
        <SectionTitle>Featured Collections</SectionTitle>
        <CategoriesGrid>
          <CategoryCard>
            <CategoryImage src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" />
            <CategoryOverlay>
              <CategoryTitle>Rings</CategoryTitle>
              <CategoryLink to="/products/rings">Shop Rings</CategoryLink>
            </CategoryOverlay>
          </CategoryCard>
          <CategoryCard>
            <CategoryImage src="https://images.unsplash.com/photo-1599643478518-17488fbbcd75?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" />
            <CategoryOverlay>
              <CategoryTitle>Necklaces</CategoryTitle>
              <CategoryLink to="/products/necklaces">Shop Necklaces</CategoryLink>
            </CategoryOverlay>
          </CategoryCard>
          <CategoryCard>
            <CategoryImage src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" />
            <CategoryOverlay>
              <CategoryTitle>Bracelets</CategoryTitle>
              <CategoryLink to="/products/bracelets">Shop Bracelets</CategoryLink>
            </CategoryOverlay>
          </CategoryCard>
        </CategoriesGrid>
      </Section>

      <WhyChooseSection>
        <SectionTitle>Why Choose JewelAura?</SectionTitle>
        <BenefitsGrid>
          <Benefit>
            <BenefitIcon>✨</BenefitIcon>
            <BenefitTitle>Premium Quality</BenefitTitle>
            <BenefitText>Handcrafted jewelry with the finest materials and attention to detail.</BenefitText>
          </Benefit>
          <Benefit>
            <BenefitIcon>🚚</BenefitIcon>
            <BenefitTitle>Free Shipping</BenefitTitle>
            <BenefitText>Complimentary shipping on all orders over $100 worldwide.</BenefitText>
          </Benefit>
          <Benefit>
            <BenefitIcon>💎</BenefitIcon>
            <BenefitTitle>Lifetime Warranty</BenefitTitle>
            <BenefitText>We stand behind our craftsmanship with a comprehensive warranty.</BenefitText>
          </Benefit>
        </BenefitsGrid>
      </WhyChooseSection>

      <TestimonialsSection>
        <SectionTitle>What Our Customers Say</SectionTitle>
        <TestimonialsGrid>
          <Testimonial>
            <TestimonialText>
              "Absolutely stunning pieces! The quality is exceptional and the customer service is outstanding. I receive compliments every time I wear my ring."
            </TestimonialText>
            <TestimonialAuthor>Sarah M.</TestimonialAuthor>
          </Testimonial>
          <Testimonial>
            <TestimonialText>
              "I've purchased multiple items and each one exceeds my expectations. The packaging is beautiful and the jewelry is even better in person."
            </TestimonialText>
            <TestimonialAuthor>Michael R.</TestimonialAuthor>
          </Testimonial>
          <Testimonial>
            <TestimonialText>
              "The perfect place to find unique, high-quality jewelry. My go-to for special occasions! The shipping was incredibly fast too."
            </TestimonialText>
            <TestimonialAuthor>Emma L.</TestimonialAuthor>
          </Testimonial>
        </TestimonialsGrid>
      </TestimonialsSection>
    </Container>
  );
};

export default Landing;