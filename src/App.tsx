import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/user/LoginPage';
import FeedPage from './components/feed/FeedPage';
import ProfilePage from './components/user/ProfilePage';
import TaggedPage from './components/feed/TaggedPage';
import UserPage from './components/user/UserPage';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/feed" element={<FeedPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/tagged/:tag" element={<TaggedPage />} />
                <Route path="/user/:userId" element={<UserPage />} />
            </Routes>
        </Router>
    );
};

export default App;
