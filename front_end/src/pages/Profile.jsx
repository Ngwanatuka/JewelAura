import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Announcement from "../components/Announcement";
import Footer from "../components/Footer";
import LoyaltyWidget from "../components/LoyaltyWidget";
import { getProfile, updateProfile } from "../services/profile";

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 50px;
  max-width: 600px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-weight: 300;
  text-align: center;
  margin-bottom: 30px;
`;

const Form = styled.form`
  background-color: #f5fafd;
  padding: 30px;
  border-radius: 10px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: teal;
  }

  &:disabled {
    background-color: #f0f0f0;
    cursor: not-allowed;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 30px;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SaveButton = styled(Button)`
  background-color: teal;
  color: white;
`;

const CancelButton = styled(Button)`
  background-color: #666;
  color: white;
`;

const Message = styled.div`
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 20px;
  text-align: center;
  background-color: ${(props) => (props.error ? "#f44336" : "#4caf50")};
  color: white;
`;

const Profile = () => {
    const user = useSelector((state) => state.user.currentUser);
    const [profile, setProfile] = useState({
        username: "",
        email: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: "", error: false });

    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                try {
                    const data = await getProfile(user._id, user.accessToken);
                    setProfile({
                        username: data.username || "",
                        email: data.email || "",
                    });
                } catch (error) {
                    console.error("Error fetching profile:", error);
                    setMessage({ text: "Error loading profile", error: true });
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchProfile();
    }, [user]);

    const handleChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: "", error: false });

        try {
            await updateProfile(user._id, profile, user.accessToken);
            setMessage({ text: "Profile updated successfully!", error: false });
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage({ text: "Error updating profile", error: true });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset form to original values
        if (user) {
            setProfile({
                username: user.username || "",
                email: user.email || "",
            });
        }
    };

    if (loading && !profile.username) {
        return (
            <Container>
                <Navbar />
                <Announcement />
                <Wrapper>
                    <Title>Loading...</Title>
                </Wrapper>
                <Footer />
            </Container>
        );
    }

    return (
        <Container>
            <Navbar />
            <Announcement />
            <Wrapper>
                <Title>My Profile</Title>
                <Form onSubmit={handleSubmit}>
                    {message.text && (
                        <Message error={message.error}>{message.text}</Message>
                    )}
                    <FormGroup>
                        <Label>Username</Label>
                        <Input
                            type="text"
                            name="username"
                            value={profile.username}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            name="email"
                            value={profile.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                        />
                    </FormGroup>
                    <ButtonContainer>
                        {isEditing ? (
                            <>
                                <SaveButton type="submit" disabled={loading}>
                                    {loading ? "Saving..." : "Save Changes"}
                                </SaveButton>
                                <CancelButton type="button" onClick={handleCancel}>
                                    Cancel
                                </CancelButton>
                            </>
                        ) : (
                            <SaveButton type="button" onClick={() => setIsEditing(true)}>
                                Edit Profile
                            </SaveButton>
                        )}
                    </ButtonContainer>
                </Form>
                {user && <LoyaltyWidget userId={user._id} />}
            </Wrapper>
            <Footer />
        </Container>
    );
};

export default Profile;
