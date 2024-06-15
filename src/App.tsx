import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/user/LoginPage';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" Component={LoginPage} />
            </Routes>
        </Router>
    );
};

export default App;
