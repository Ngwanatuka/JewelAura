import styled from "styled-components";
import { Search, ShoppingCartOutlined, Menu as MenuIcon, Close } from "@material-ui/icons";
import { Badge } from "@mui/material";
import { mobile, tablet } from "../responsive";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/userRedux";
import { useState, useEffect } from "react";

const Container = styled.div`
  height: 70px;
  position: sticky;
  top: 0;
  z-index: 999;
  background-color: ${(props) => (props.$scrolled ? "rgba(255, 255, 255, 0.9)" : "var(--bg-main, #fff)")};
  backdrop-filter: ${(props) => (props.$scrolled ? "blur(10px)" : "none")};
  box-shadow: ${(props) => (props.$scrolled ? "var(--shadow-md, 0 2px 8px rgba(0,0,0,0.08))" : "none")};
  transition: all 0.3s ease;
  ${mobile({ height: "60px" })}
`;

const Wrapper = styled.div`
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  box-sizing: border-box;
  ${tablet({ padding: "10px 14px" })}
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
  ${tablet({ display: "none" })}
`;

const SearchContainer = styled.form`
  display: flex;
  align-items: center;
  border: 1px solid lightgray;
  margin-left: 25px;
  padding: 5px 10px;
  border-radius: 20px;
  background-color: white;
  transition: all 0.3s ease;
  &:focus-within {
    border-color: var(--primary, teal);
    box-shadow: 0 0 0 2px rgba(0, 128, 128, 0.1);
  }
  ${tablet({ display: "none" })}
`;

const Input = styled.input`
  border: none;
  background-color: transparent;
  outline: none;
  padding-left: 5px;
  font-family: var(--font-body);
  width: 140px;
`;

const Center = styled.div`
  flex: 1;
  text-align: center;
`;

const Logo = styled.h1`
  font-weight: 700;
  font-family: var(--font-heading);
  color: var(--primary, teal);
  letter-spacing: 1px;
  font-size: 26px;
  ${tablet({ fontSize: "22px" })}
  ${mobile({ fontSize: "18px" })}
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`;

const DesktopNav = styled.div`
  display: flex;
  align-items: center;
  ${tablet({ display: "none" })}
`;

const MenuItem = styled.div`
  font-size: 14px;
  cursor: pointer;
  margin-left: 22px;
  font-weight: 500;
  transition: color 0.2s;
  white-space: nowrap;
  &:hover {
    color: var(--primary, teal);
  }
`;

const CartLink = styled(Link)`
  color: inherit;
  display: flex;
  align-items: center;
  margin-left: 16px;
  ${tablet({ marginLeft: "8px" })}
`;

const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  color: #333;
  align-items: center;
  justify-content: center;
  ${tablet({ display: "flex" })}
`;

const MobileDrawer = styled.div`
  display: none;
  ${tablet({ display: "flex" })}
  flex-direction: column;
  gap: 12px;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  padding: 16px 20px 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  border-top: 1px solid #eee;
  z-index: 998;
`;

const MobileSearchForm = styled.form`
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 6px 12px;
  background: #fafafa;
`;

const MobileSearchInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  flex: 1;
  font-size: 14px;
`;

const MobileNavLink = styled(Link)`
  text-decoration: none;
  color: #333;
  font-size: 15px;
  font-weight: 500;
  padding: 8px 4px;
  border-bottom: 1px solid #f2f2f2;
`;

const MobileActionButton = styled.button`
  background: none;
  border: none;
  text-align: left;
  color: #c62828;
  font-size: 15px;
  font-weight: 500;
  padding: 8px 4px;
  cursor: pointer;
`;

const Navbar = () => {
  const quantity = useSelector((state) => state.cart.quantity);
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    setMobileMenuOpen(false);
    dispatch(logout());
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    setMobileMenuOpen(false);
    if (trimmed) {
      navigate(`/products?search=${encodeURIComponent(trimmed)}`);
    } else {
      navigate("/products");
    }
  };

  return (
    <Container $scrolled={scrolled}>
      <Wrapper>
        <Left>
          <HamburgerButton
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? <Close /> : <MenuIcon />}
          </HamburgerButton>
          <Language>EN</Language>
          <SearchContainer onSubmit={handleSearchSubmit}>
            <Input
              placeholder="Search jewelry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              aria-label="Search"
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex" }}
            >
              <Search style={{ color: "gray", fontSize: 18 }} />
            </button>
          </SearchContainer>
        </Left>
        <Center>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Logo>JEWELAURA</Logo>
          </Link>
        </Center>
        <Right>
          <DesktopNav>
            {user ? (
              <>
                {user.isAdmin && (
                  <Link to="/admin" style={{ textDecoration: "none", color: "inherit" }}>
                    <MenuItem>ADMIN</MenuItem>
                  </Link>
                )}
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
          </DesktopNav>

          <CartLink to="/cart" aria-label="Shopping cart">
            <Badge badgeContent={quantity} color="primary">
              <ShoppingCartOutlined />
            </Badge>
          </CartLink>
        </Right>
      </Wrapper>

      {mobileMenuOpen && (
        <MobileDrawer>
          <MobileSearchForm onSubmit={handleSearchSubmit}>
            <MobileSearchInput
              placeholder="Search jewelry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              aria-label="Search"
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex" }}
            >
              <Search style={{ color: "gray", fontSize: 18 }} />
            </button>
          </MobileSearchForm>
          <MobileNavLink to="/products" onClick={() => setMobileMenuOpen(false)}>
            All Products
          </MobileNavLink>
          {user ? (
            <>
              {user.isAdmin && (
                <MobileNavLink to="/admin" onClick={() => setMobileMenuOpen(false)}>
                  Admin Dashboard
                </MobileNavLink>
              )}
              <MobileNavLink to="/profile" onClick={() => setMobileMenuOpen(false)}>
                Profile
              </MobileNavLink>
              <MobileNavLink to="/favorites" onClick={() => setMobileMenuOpen(false)}>
                Favorites
              </MobileNavLink>
              <MobileNavLink to="/orders" onClick={() => setMobileMenuOpen(false)}>
                Orders
              </MobileNavLink>
              <MobileActionButton type="button" onClick={handleLogout}>
                Logout
              </MobileActionButton>
            </>
          ) : (
            <>
              <MobileNavLink to="/login" onClick={() => setMobileMenuOpen(false)}>
                Sign In
              </MobileNavLink>
              <MobileNavLink to="/register" onClick={() => setMobileMenuOpen(false)}>
                Register
              </MobileNavLink>
            </>
          )}
        </MobileDrawer>
      )}
    </Container>
  );
};

export default Navbar;
