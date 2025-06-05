import { Send } from "@material-ui/icons";
import styled from "styled-components";
import { mobile } from "../responsive";

const Container = styled.div`
  width: 90vw;
  height: 40vh;
  margin: 0 auto;
  background-color: #fcf5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 10px;
  ${mobile({ width: "100vw", height: "auto" })}
`;

const Title = styled.h1`
  font-size: 70px;
  margin-bottom: 20px;
`;

const Desc = styled.div`
  font-size: 24px;
  font-weight: 300;
  margin-bottom: 20px;
  ${mobile({ textAlign: "center" })}
`;

const InputContainer = styled.div`
  width: 50%;
  height: 40px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  border: 1px solid lightgray;
  border-radius: 5px;
  ${mobile({ width: "80%" })}
`;

const Input = styled.input`
  border: none;
  flex: 8;
  padding-left: 20px;
  padding: 12px;
  
  border-radius: 5px;
  transition: all 0.3s ease;
  &:hover {
    border-color: #888;
    box-shadow: 0 0 5px rgb(110, 152, 152);
  }
  &:focus {
    outline: none;
    border-color: teal;
  }
`;

const Button = styled.button`
  flex: 1;
  border: none;
  background-color: teal;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.3s ease;
  &:hover {
    background-color: #888;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  }
`;




/**
 * Newsletter component. It displays a newsletter form with a title, description, input field and send button.
 * @returns {JSX.Element} The newsletter component.
 */
const Newsletter = () => {
  return (
    <Container>
      <Title>Newsletter</Title>
      <Desc>Get timely updates from your favourite products</Desc>
      <InputContainer>
        <Input placeholder="Your email" />
        <Button>
          <Send />
        </Button>
      </InputContainer>
    </Container>
  );
};

export default Newsletter;
