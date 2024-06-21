import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/api';


const LoginPage: React.FC = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();  // useNavigate 훅을 사용합니다.

  const handleLogin = async () => {
    try {
      const response = await login(usernameOrEmail, password);
      console.log('Login successful:', response);

      // Save the token to localStorage
      localStorage.setItem('accessToken', response.access);
      localStorage.setItem('refreshToken', response.refresh);

      navigate('/feed');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden">
      <div className="flex h-full grow flex-col items-center justify-center px-4">
        <div className="flex flex-col lg:flex-row items-center justify-center max-w-6xl w-full">
          <div className="w-full lg:w-3/5 lg:block hidden">
            <div
              className="w-full h-full bg-center bg-no-repeat bg-cover rounded-xl min-h-[700px]"
              style={{ backgroundImage: 'url("https://i.ibb.co/bz8LLtK/login-image.png")' }}
            ></div>
          </div>
          <div className="flex flex-col gap-6 w-full lg:w-2/5 p-8">
            <h1 className="text-[#111418] text-4xl font-black leading-tight tracking-[-0.033em] text-center lg:text-left">
              Log in to Origram
            </h1>
            <label className="flex flex-col min-w-40 h-14 w-full">
              <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                <div
                  className="text-[#637588] flex border-none bg-[#f0f2f4] items-center justify-center pl-4 rounded-l-xl border-r-0"
                  data-icon="MagnifyingGlass" data-size="20px" data-weight="regular"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                  </svg>
                </div>
                <input
                  placeholder="Username, or email"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] focus:border-none h-full placeholder:text-[#637588] px-4 rounded-r-none border-r-0 pr-2 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal lg:text-base"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                />
              </div>
            </label>
            <label className="flex flex-col min-w-40 h-14 w-full">
              <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                <input
                  type="password"
                  placeholder="Password"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dce0e5] bg-white focus:border-[#dce0e5] h-14 placeholder:text-[#637588] p-[15px] text-base font-normal leading-normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </label>
            <div className="flex px-4 py-3 w-full">
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 flex-1 bg-[#1972d2] text-white text-sm font-bold leading-normal tracking-[0.015em]"
                onClick={handleLogin}
              >
                <span className="truncate">Log In</span>
              </button>
            </div>
            <p className="text-[#637588] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline">Forgot password?</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
