import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export const login = async (usernameOrEmail: string, password: string) => {
    const response = await api.post('/auth/login/', {
      username_or_email: usernameOrEmail,
      password,
    });
    return response.data;
  };

export const getFollowingFeed = async (token: string) => {
  const response = await api.get('/feed/', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getFollowingUsers = async (token: string) => {
  const response = await api.get('/users/following/', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
