import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { publicRequest } from "../requestMethods";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.12),
      rgba(255, 255, 255, 0.5)
    ),
    url("https://images.pexels.com/photos/3829444/pexels-photo-3829444.jpeg?auto=compress&cs=tinysrgb&w=600")
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

const Agreement = styled.span`
  font-size: 12px;
  margin: 20px 0;
  color: #555;
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
`;

const Register = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (userDetails.password !== userDetails.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await publicRequest.post("/auth/register", {
        username: userDetails.username,
        email: userDetails.email,
        password: userDetails.password
      });

      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>CREATE AN ACCOUNT</Title>
        <Form onSubmit={handleRegister}>
          <Input name="username" placeholder="username" onChange={handleInputChange} />
          <Input name="email" placeholder="email" onChange={handleInputChange} />
          <Input name="password" placeholder="password" type="password" onChange={handleInputChange} />
          <Input name="confirmPassword" placeholder="confirm password" type="password" onChange={handleInputChange} />
          <Agreement>
            By creating an account, I consent to the processing of my personal
            data in accordance with the <b>PRIVACY POLICY</b>
          </Agreement>
          <Button type="submit">CREATE</Button>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Register;