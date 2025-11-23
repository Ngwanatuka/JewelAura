import styled from "styled-components";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

const Container = styled.div``;

const Main = styled.div`
  display: flex;
`;

const Content = styled.div`
  flex: 4;
`;

const AdminLayout = () => {
    return (
        <Container>
            <Topbar />
            <Main>
                <Sidebar />
                <Content>
                    <Outlet />
                </Content>
            </Main>
        </Container>
    );
};

export default AdminLayout;
