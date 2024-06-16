import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/user/LoginPage';
import FeedPage from './components/feed/FeedPage';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/feed" element={<FeedPage />} />
            </Routes>
        </Router>
    );
};

export default App;
