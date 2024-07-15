import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../../context/RegisterContext';

const BirthPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useRegister();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/register/setting-profile');
  };

  const handleToLogin = () => {
    navigate('/login');
  }

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-white p-8 shadow rounded-lg">
          <img className="mx-auto h-25 w-auto" src="/image/birth-logo.png" alt="Origram" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">생일 추가</h2>
          <h2 className="mt-10 text-center text-1xl font-bold leading-9 tracking-tight text-gray-900">공개 프로필에 포함되지 않습니다.</h2>
          <form className="space-y-6 mt-10" onSubmit={handleNext}>
            <div>
              <input
                required
                type="date"
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="생년월일"
                value={state.birth_date}
                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'birth_date', value: e.target.value })}
              />
            </div>
            <h2 className="mt-10 text-center text-1xl font-bold leading-9 tracking-tight text-gray-900">태어난 날짜를 입력해야합니다.</h2>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-sky-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                다음
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-blue-500 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                돌아가기
              </button>
            </div>
          </form>
        </div>
        <div className="bg-white p-4 shadow rounded-lg mt-4">
          <p className="text-center text-sm text-blue-500 cursor-pointer" onClick={handleToLogin}>
            이미 계정이 있으신가요?
          </p>
        </div>
      </div>
    </div>
  );
};

export default BirthPage;
