import styled from "styled-components";
import { NotificationsNone, Language, Settings } from "@material-ui/icons";
import { Link } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  height: 50px;
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 999;
`;

const Wrapper = styled.div`
  height: 100%;
  padding: 0px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.span`
  font-weight: bold;
  font-size: 30px;
  color: teal;
  cursor: pointer;
`;

const TopRight = styled.div`
  display: flex;
  align-items: center;
`;

const IconContainer = styled.div`
  position: relative;
  cursor: pointer;
  margin-right: 10px;
  color: #555;
`;

const IconBadge = styled.span`
  width: 15px;
  height: 15px;
  position: absolute;
  top: -5px;
  right: 0px;
  background-color: red;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
`;

const Topbar = () => {
    return (
        <Container>
            <Wrapper>
                <Link to="/admin" style={{ textDecoration: "none" }}>
                    <Logo>JewelAura Admin</Logo>
                </Link>
                <TopRight>
                    <IconContainer>
                        <NotificationsNone />
                        <IconBadge>2</IconBadge>
                    </IconContainer>
                    <IconContainer>
                        <Language />
                        <IconBadge>2</IconBadge>
                    </IconContainer>
                    <IconContainer>
                        <Settings />
                    </IconContainer>
                    <Avatar src="https://images.pexels.com/photos/1526814/pexels-photo-1526814.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" alt="" />
                </TopRight>
            </Wrapper>
        </Container>
    );
};

export default Topbar;
