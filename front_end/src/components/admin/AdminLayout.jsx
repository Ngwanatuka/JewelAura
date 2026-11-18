import { useState } from "react";
import styled from "styled-components";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";
import { tablet } from "../../responsive";

const Container = styled.div``;

const MobileToggleBar = styled.div`
  display: none;
  padding: 10px 16px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  ${tablet({ display: "flex", justifyContent: "space-between", alignItems: "center" })}
`;

const ToggleButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
`;

const Main = styled.div`
  display: flex;
  ${tablet({ flexDirection: "column" })}
`;

const SidebarWrapper = styled.div`
  flex: 1;
  min-width: 210px;
  ${tablet({
  display: (props) => (props.$open ? "block" : "none"),
  width: "100%",
})}
`;

const Content = styled.div`
  flex: 4;
  min-width: 0;
  overflow-x: auto;
`;

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Container>
      <Topbar />
      <MobileToggleBar>
        <span style={{ fontSize: "14px", fontWeight: 500, color: "#555" }}>Admin Menu</span>
        <ToggleButton type="button" onClick={() => setSidebarOpen((prev) => !prev)}>
          {sidebarOpen ? "Hide Menu" : "Show Menu"}
        </ToggleButton>
      </MobileToggleBar>
      <Main>
        <SidebarWrapper $open={sidebarOpen}>
          <Sidebar />
        </SidebarWrapper>
        <Content>
          <Outlet />
        </Content>
      </Main>
    </Container>
  );
};

export default AdminLayout;
