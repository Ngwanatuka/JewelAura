import styled from "styled-components";
import { Person, ExitToApp, Palette, Notifications, Lock } from "@material-ui/icons";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/userRedux";
import { useNavigate } from "react-router-dom";

const Dropdown = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  width: 250px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
`;

const Header = styled.div`
  padding: 15px;
  border-bottom: 1px solid #eee;
  font-weight: 600;
  color: #333;
`;

const MenuList = styled.div`
  padding: 8px 0;
`;

const MenuItem = styled.div`
  padding: 12px 15px;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #555;
  
  &:hover {
    background: #f9f9f9;
  }
  
  svg {
    font-size: 20px;
    color: #666;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #eee;
  margin: 8px 0;
`;

const LogoutItem = styled(MenuItem)`
  color: #f44336;
  
  svg {
    color: #f44336;
  }
  
  &:hover {
    background: #ffebee;
  }
`;

const SettingsDropdown = ({ onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
        onClose();
    };

    return (
        <Dropdown onClick={(e) => e.stopPropagation()}>
            <Header>Settings</Header>
            <MenuList>
                <MenuItem onClick={() => navigate("/profile")}>
                    <Person />
                    <span>My Profile</span>
                </MenuItem>
                <MenuItem>
                    <Palette />
                    <span>Appearance</span>
                </MenuItem>
                <MenuItem>
                    <Notifications />
                    <span>Notifications</span>
                </MenuItem>
                <MenuItem>
                    <Lock />
                    <span>Privacy & Security</span>
                </MenuItem>
                <Divider />
                <LogoutItem onClick={handleLogout}>
                    <ExitToApp />
                    <span>Logout</span>
                </LogoutItem>
            </MenuList>
        </Dropdown>
    );
};

export default SettingsDropdown;
