import styled from "styled-components";
import { Email, Person } from "@material-ui/icons";

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

const MessageList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const MessageItem = styled.div`
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

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
  font-weight: 600;
  font-size: 16px;
`;

const Content = styled.div`
  flex: 1;
`;

const Name = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  color: #333;
`;

const Message = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

const UnreadDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00a9e0;
  margin-left: auto;
`;

const MessagesDropdown = ({ onClose }) => {
    // Mock messages data
    const messages = [
        {
            id: 1,
            name: 'Sarah Johnson',
            message: 'Hi, I have a question about my order...',
            time: '10 min ago',
            unread: true,
            initials: 'SJ'
        },
        {
            id: 2,
            name: 'Mike Peters',
            message: 'When will the Diamond Ring be back in stock?',
            time: '1 hour ago',
            unread: true,
            initials: 'MP'
        },
        {
            id: 3,
            name: 'Emma Wilson',
            message: 'Thank you for the quick delivery!',
            time: '3 hours ago',
            unread: false,
            initials: 'EW'
        }
    ];

    const unreadCount = messages.filter(m => m.unread).length;

    return (
        <Dropdown onClick={(e) => e.stopPropagation()}>
            <Header>
                <span>Messages</span>
                <Badge>{unreadCount}</Badge>
            </Header>
            <MessageList>
                {messages.map((msg) => (
                    <MessageItem key={msg.id}>
                        <Avatar>{msg.initials}</Avatar>
                        <Content>
                            <Name>{msg.name}</Name>
                            <Message>{msg.message}</Message>
                            <Time>{msg.time}</Time>
                        </Content>
                        {msg.unread && <UnreadDot />}
                    </MessageItem>
                ))}
            </MessageList>
            <Footer>
                <a href="/admin/messages">View all messages</a>
            </Footer>
        </Dropdown>
    );
};

export default MessagesDropdown;
