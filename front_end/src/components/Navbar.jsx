import styled from "styled-components";
import { Search, ShoppingCartOutlined } from "@material-ui/icons";
import { Badge } from "@mui/material";
import { mobile } from "../responsive";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../redux/userRedux";
import { useState, useEffect } from "react";

const Container = styled.div`
  height: 70px;
  position: sticky;
  top: 0;
  z-index: 999;
  background-color: ${props => props.scrolled ? "rgba(255, 255, 255, 0.8)" : "var(--bg-main)"};
  backdrop-filter: ${props => props.scrolled ? "blur(10px)" : "none"};
  box-shadow: ${props => props.scrolled ? "var(--shadow-md)" : "none"};
  transition: all 0.3s ease;
  ${mobile({ height: "60px" })}
`;

const Wrapper = styled.div`
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${mobile({ padding: "10px 0px" })}
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const Language = styled.span`
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  ${mobile({ display: "none" })}
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid lightgray;
  margin-left: 25px;
  padding: 5px;
  border-radius: 20px;
  background-color: white;
  transition: all 0.3s ease;
  &:focus-within {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(0, 128, 128, 0.1);
  }
  ${mobile({ marginLeft: "10px" })}
`;

const Input = styled.input`
  border: none;
  background-color: transparent;
  outline: none;
  padding-left: 5px;
  font-family: var(--font-body);
  ${mobile({ width: "50px" })}
`;

const Center = styled.div`
  flex: 1;
  text-align: center;
`;

const Logo = styled.h1`
  font-weight: 700;
  font-family: var(--font-heading);
  color: var(--primary);
  letter-spacing: 1px;
  ${mobile({ fontSize: "20px" })}
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  ${mobile({ flex: 2, justifyContent: "center" })}
`;

const MenuItem = styled.div`
  font-size: 14px;
  cursor: pointer;
  margin-left: 25px;
  font-weight: 500;
  transition: color 0.2s;
  &:hover {
    color: var(--primary);
  }
  ${mobile({ fontSize: "12px", marginLeft: "10px" })}
`;

const Navbar = () => {
  const quantity = useSelector((state) => state.cart.quantity);
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Container scrolled={scrolled}>
      <Wrapper>
        <Left>
          <Language>EN</Language>
          <SearchContainer>
            <Input placeholder="Search" />
            <Search style={{ color: "gray", fontSize: 16 }} />
          </SearchContainer>
        </Left>
        <Center>
          <Link to={"/"} style={{ textDecoration: "none" }}>
            <Logo>JEWELAURA</Logo>
          </Link>
        </Center>
        <Right>
          {user ? (
            <>
              <Link to="/profile" style={{ textDecoration: "none", color: "inherit" }}>
                <MenuItem>PROFILE</MenuItem>
              </Link>
              <Link to="/favorites" style={{ textDecoration: "none", color: "inherit" }}>
                <MenuItem>FAVORITES</MenuItem>
              </Link>
              <Link to="/orders" style={{ textDecoration: "none", color: "inherit" }}>
                <MenuItem>ORDERS</MenuItem>
              </Link>
              <MenuItem onClick={handleLogout}>LOGOUT</MenuItem>
            </>
          ) : (
            <>
              <Link to="/register" style={{ textDecoration: "none", color: "inherit" }}>
                <MenuItem>REGISTER</MenuItem>
              </Link>
              <Link to="/login" style={{ textDecoration: "none", color: "inherit" }}>
                <MenuItem>SIGN IN</MenuItem>
              </Link>
            </>
          )}

          <Link to="/cart" style={{ color: "inherit" }}>
            <MenuItem>
              <Badge badgeContent={quantity} color="primary">
                <ShoppingCartOutlined />
              </Badge>
            </MenuItem>
          </Link>
        </Right>
      </Wrapper>
    </Container>
  );
};

export default Navbar;
