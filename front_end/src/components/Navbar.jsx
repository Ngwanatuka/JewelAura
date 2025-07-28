import styled from "styled-components";
import { Search, ShoppingCartOutlined } from "@material-ui/icons";
import { Badge } from "@mui/material";
import { mobile } from "../responsive";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../redux/userRedux";

const Container = styled.div`
margin-top: 5px;
  height: 70px;
  background-color:hsl(0, 100.00%, 99.80%);
  ${mobile({ height: "50px" })}
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
  ${mobile({ display: "none" })}
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid lightgray;
  margin-left: 25px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: all 0.3s ease;
  ${mobile({ marginLeft: "10px" })}
`;

const Input = styled.input`
  border: none;
  background-color: transparent;
  &:hover {
    border-color: #888;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  }
  &:focus {
    outline: none;
    border-color: teal;
  }
  ${mobile({ width: "55px" })}
`;

const Center = styled.div`
  flex: 1;
  text-align: center;
`;

const Logo = styled.h1`
  font-weight: 500;
  ${mobile({ fontSize: "15px" })}
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  ${mobile({ flex: 2, justifyContent: "center", textAlign: "center" })}
`;

const MenuItem = styled.div`
  font-size: 14px;
  cursor: pointer;
  margin-left: 25px;
  ${mobile({ fontSize: "12px", marginLeft: "10px" })}
`;

const Navbar = () => {
  const quantity = useSelector((state) => state.cart.quantity);
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Container>
      <Wrapper>
        <Left>
          <Language>EN</Language>
          <SearchContainer>
            <Input placeholder="Search" />
            <Search style={{ color: "gray", fontSize: 16 }} />
          </SearchContainer>
        </Left>
        <Center>
          <Link to={"/"} style={{ textDecoration: "none", color: "black" }}>
            <Logo>JEWELAURA</Logo>
          </Link>
        </Center>
        <Right>
          {user ? (
            <MenuItem onClick={handleLogout}>LOGOUT</MenuItem>
          ) : (
            <>
              <Link to="/register" style={{ textDecoration: "none", color: "black" }}>
                <MenuItem>REGISTER</MenuItem>
              </Link>
              <Link to="/login" style={{ textDecoration: "none", color: "black" }}>
                <MenuItem>SIGN IN</MenuItem>
              </Link>
            </>
          )}

          <Link to="/cart" style={{ color: "black" }}>
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
