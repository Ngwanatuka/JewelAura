import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
  background: #fafafa;
  color: #333;
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 12px;
  color: #1a1a1a;
`;

const Message = styled.p`
  font-size: 15px;
  color: #666;
  max-width: 460px;
  margin-bottom: 24px;
  line-height: 1.5;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  background: ${(props) => (props.$secondary ? "#eee" : "teal")};
  color: ${(props) => (props.$secondary ? "#333" : "#fff")};
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Wrapper>
          <Title>Something went wrong</Title>
          <Message>
            An unexpected error occurred while rendering this page. Please reload or return to the home page.
          </Message>
          <Actions>
            <Button onClick={() => window.location.reload()}>Reload Page</Button>
            <Button $secondary onClick={() => { window.location.href = "/"; }}>
              Go Home
            </Button>
          </Actions>
        </Wrapper>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
