import styled from "styled-components";
import {
    LineStyle,
    Timeline,
    TrendingUp,
    PermIdentity,
    Storefront,
    AttachMoney,
    BarChart,
    MailOutline,
    DynamicFeed,
    ChatBubbleOutline,
    WorkOutline,
    Report,
} from "@material-ui/icons";
import { Link, useLocation } from "react-router-dom";

const Container = styled.div`
  flex: 1;
  height: calc(100vh - 50px);
  background-color: rgb(251, 251, 255);
  position: sticky;
  top: 50px;
`;

const Wrapper = styled.div`
  padding: 20px;
  color: #555;
`;

const Menu = styled.div`
  margin-bottom: 10px;
`;

const Title = styled.h3`
  font-size: 13px;
  color: rgb(187, 186, 186);
`;

const List = styled.ul`
  list-style: none;
  padding: 5px;
`;

const ListItem = styled.li`
  padding: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 10px;
  background-color: ${(props) => (props.active ? "rgb(240, 240, 255)" : "transparent")};

  &:hover {
    background-color: rgb(240, 240, 255);
  }
`;

const Sidebar = () => {
    const location = useLocation();
    const path = location.pathname;

    return (
        <Container>
            <Wrapper>
                <Menu>
                    <Title>Dashboard</Title>
                    <List>
                        <Link to="/admin" style={{ textDecoration: "none", color: "inherit" }}>
                            <ListItem active={path === "/admin"}>
                                <LineStyle style={{ marginRight: "5px", fontSize: "20px" }} />
                                Home
                            </ListItem>
                        </Link>
                        <Link to="/admin/analytics" style={{ textDecoration: "none", color: "inherit" }}>
                            <ListItem active={path === "/admin/analytics"}>
                                <Timeline style={{ marginRight: "5px", fontSize: "20px" }} />
                                Analytics
                            </ListItem>
                        </Link>
                        <Link to="/admin/sales" style={{ textDecoration: "none", color: "inherit" }}>
                            <ListItem active={path === "/admin/sales"}>
                                <TrendingUp style={{ marginRight: "5px", fontSize: "20px" }} />
                                Sales
                            </ListItem>
                        </Link>
                    </List>
                </Menu>
                <Menu>
                    <Title>Quick Menu</Title>
                    <List>
                        <Link to="/admin/users" style={{ textDecoration: "none", color: "inherit" }}>
                            <ListItem active={path === "/admin/users"}>
                                <PermIdentity style={{ marginRight: "5px", fontSize: "20px" }} />
                                Users
                            </ListItem>
                        </Link>
                        <Link to="/admin/products" style={{ textDecoration: "none", color: "inherit" }}>
                            <ListItem active={path === "/admin/products"}>
                                <Storefront style={{ marginRight: "5px", fontSize: "20px" }} />
                                Products
                            </ListItem>
                        </Link>
                        <Link to="/admin/orders" style={{ textDecoration: "none", color: "inherit" }}>
                            <ListItem active={path === "/admin/orders"}>
                                <AttachMoney style={{ marginRight: "5px", fontSize: "20px" }} />
                                Orders
                            </ListItem>
                        </Link>
                        <ListItem>
                            <BarChart style={{ marginRight: "5px", fontSize: "20px" }} />
                            Reports
                        </ListItem>
                    </List>
                </Menu>
                <Menu>
                    <Title>Notifications</Title>
                    <List>
                        <ListItem>
                            <MailOutline style={{ marginRight: "5px", fontSize: "20px" }} />
                            Mail
                        </ListItem>
                        <ListItem>
                            <DynamicFeed style={{ marginRight: "5px", fontSize: "20px" }} />
                            Feedback
                        </ListItem>
                        <ListItem>
                            <ChatBubbleOutline style={{ marginRight: "5px", fontSize: "20px" }} />
                            Messages
                        </ListItem>
                    </List>
                </Menu>
                <Menu>
                    <Title>Staff</Title>
                    <List>
                        <ListItem>
                            <WorkOutline style={{ marginRight: "5px", fontSize: "20px" }} />
                            Manage
                        </ListItem>
                        <ListItem>
                            <Timeline style={{ marginRight: "5px", fontSize: "20px" }} />
                            Analytics
                        </ListItem>
                        <ListItem>
                            <Report style={{ marginRight: "5px", fontSize: "20px" }} />
                            Reports
                        </ListItem>
                    </List>
                </Menu>
            </Wrapper>
        </Container>
    );
};

export default Sidebar;
