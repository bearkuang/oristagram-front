import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/user/LoginPage';
import FeedPage from './components/feed/FeedPage';
import ProfilePage from './components/user/ProfilePage';
import TaggedPage from './components/feed/TaggedPage';
import UserPage from './components/user/UserPage';
import JoinPage from './components/user/JoinPage';
import BirthPage from './components/user/BirthPage';
import SettingProfilePage from './components/user/SettingProfilePage';
import { RegisterProvider } from './context/RegisterContext';

const App: React.FC = () => {
    return (
        <RegisterProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/feed" element={<FeedPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/tagged/:tag" element={<TaggedPage />} />
                    <Route path="/user/:userId" element={<UserPage />} />
                    <Route path="/register" element={<JoinPage />} />
                    <Route path="/register/birth" element={<BirthPage />} />
                    <Route path="/register/setting-profile" element={<SettingProfilePage />} />
                </Routes>
            </Router>
        </RegisterProvider>
    );
};

export default App;
