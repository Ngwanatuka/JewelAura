import styled from "styled-components";
import { NotificationsNone, Language, Settings } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import NotificationDropdown from "./NotificationDropdown";
import MessagesDropdown from "./MessagesDropdown";
import SettingsDropdown from "./SettingsDropdown";

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
  padding: 8px;
  border-radius: 50%;
  transition: background 0.2s;
  
  &:hover {
    background: #f5f5f5;
  }
  
  &.active {
    background: #e3f2fd;
    color: #00a9e0;
  }
`;

const IconBadge = styled.span`
  width: 15px;
  height: 15px;
  position: absolute;
  top: 5px;
  right: 5px;
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
  margin-left: 10px;
`;

const Topbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    if (activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <Container>
      <Wrapper>
        <Link to="/admin" style={{ textDecoration: "none" }}>
          <Logo>JewelAura Admin</Logo>
        </Link>
        <TopRight ref={dropdownRef}>
          <IconContainer
            className={activeDropdown === 'notifications' ? 'active' : ''}
            onClick={() => toggleDropdown('notifications')}
          >
            <NotificationsNone />
            <IconBadge>2</IconBadge>
            {activeDropdown === 'notifications' && (
              <NotificationDropdown onClose={() => setActiveDropdown(null)} />
            )}
          </IconContainer>

          <IconContainer
            className={activeDropdown === 'messages' ? 'active' : ''}
            onClick={() => toggleDropdown('messages')}
          >
            <Language />
            <IconBadge>2</IconBadge>
            {activeDropdown === 'messages' && (
              <MessagesDropdown onClose={() => setActiveDropdown(null)} />
            )}
          </IconContainer>

          <IconContainer
            className={activeDropdown === 'settings' ? 'active' : ''}
            onClick={() => toggleDropdown('settings')}
          >
            <Settings />
            {activeDropdown === 'settings' && (
              <SettingsDropdown onClose={() => setActiveDropdown(null)} />
            )}
          </IconContainer>

          <Avatar src="https://images.pexels.com/photos/1526814/pexels-photo-1526814.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" alt="" />
        </TopRight>
      </Wrapper>
    </Container>
  );
};

export default Topbar;
