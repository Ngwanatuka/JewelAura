import { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/apiCalls";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.12),
      rgba(255, 255, 255, 0.5)
    ),
    url("/login_background.png")
      center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 25%;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 400;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 10px 0;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: all 0.3s ease;
  &:hover {
    border-color: #888;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  }
  &:focus {
    outline: none;
    border-color: teal;
  }
`;

const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 20px;
  background-color: teal;
  color: white;
  cursor: pointer;
  margin-bottom: 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #008080;
  }
  &:disabled {
    background-color: #9e9e9e;
    cursor: not-allowed;
  }
`;

const Link = styled.a`
  margin: 5px 0;
  font-size: 12px;
  text-decoration: underline;
  cursor: pointer;
  color: #555;
  transition: color 0.3s ease;
  &:hover {
    color: teal;
  }
`;

const Error = styled.span`
  color: red;
  margin: 10px 0;
  font-size: 14px;
`;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isFetching, error } = useSelector((state) => state.user);

  const handleClick = (e) => {
    e.preventDefault();
    login(dispatch, { username, password });
  };

  const handleRegisterLinkClick = () => {
    navigate("/register");
  };

  return (
    <Container>
      <Wrapper>
        <Title>SIGN IN</Title>
        <Form>
          <Input
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={handleClick} disabled={isFetching}>
            LOGIN
          </Button>
          {error && <Error>Something went wrong...</Error>}
          <Link>DO NOT YOU REMEMBER THE PASSWORD?</Link>
          <Link onClick={handleRegisterLinkClick}>CREATE A NEW ACCOUNT</Link>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Login;