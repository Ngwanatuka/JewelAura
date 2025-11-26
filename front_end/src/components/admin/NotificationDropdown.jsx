import styled from "styled-components";
import { ShoppingCart, AssignmentReturn, Info } from "@material-ui/icons";
import { useState } from "react";

const Dropdown = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  width: 350px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
`;

const Header = styled.div`
  padding: 15px;
  border-bottom: 1px solid #eee;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NotificationList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const NotificationItem = styled.div`
  padding: 12px 15px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  gap: 12px;
  
  &:hover {
    background: #f9f9f9;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.bg || '#e3f2fd'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    color: ${props => props.color || '#2196f3'};
    font-size: 20px;
  }
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  color: #333;
`;

const Description = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
`;

const Time = styled.div`
  font-size: 11px;
  color: #999;
`;

const Footer = styled.div`
  padding: 12px 15px;
  text-align: center;
  border-top: 1px solid #eee;
  
  a {
    color: #00a9e0;
    text-decoration: none;
    font-size: 13px;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Badge = styled.span`
  background: #00a9e0;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
`;

const NotificationDropdown = ({ onClose }) => {
    // Mock notifications data
    const notifications = [
        {
            id: 1,
            type: 'order',
            title: 'New Order Received',
            description: 'Order #F8 - R1058.00',
            time: '5 minutes ago',
            icon: ShoppingCart,
            bg: '#e8f5e9',
            color: '#4caf50'
        },
        {
            id: 2,
            type: 'return',
            title: 'Return Request',
            description: 'Customer requested return for Order #A3',
            time: '2 hours ago',
            icon: AssignmentReturn,
            bg: '#fff3e0',
            color: '#ff9800'
        },
        {
            id: 3,
            type: 'info',
            title: 'Low Stock Alert',
            description: 'Gold Bracelet stock is running low',
            time: '1 day ago',
            icon: Info,
            bg: '#e3f2fd',
            color: '#2196f3'
        }
    ];

    return (
        <Dropdown onClick={(e) => e.stopPropagation()}>
            <Header>
                <span>Notifications</span>
                <Badge>{notifications.length}</Badge>
            </Header>
            <NotificationList>
                {notifications.map((notif) => {
                    const Icon = notif.icon;
                    return (
                        <NotificationItem key={notif.id}>
                            <IconWrapper bg={notif.bg} color={notif.color}>
                                <Icon />
                            </IconWrapper>
                            <Content>
                                <Title>{notif.title}</Title>
                                <Description>{notif.description}</Description>
                                <Time>{notif.time}</Time>
                            </Content>
                        </NotificationItem>
                    );
                })}
            </NotificationList>
            <Footer>
                <a href="/admin/notifications">View all notifications</a>
            </Footer>
        </Dropdown>
    );
};

export default NotificationDropdown;
