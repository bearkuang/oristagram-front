import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../../context/RegisterContext';

const JoinPage: React.FC = () => {
    const navigate = useNavigate();
    const { state, dispatch } = useRegister();

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/register/birth');
    };

    const handleToLogin = () => {
        navigate('/login');
    }

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="bg-white p-8 shadow rounded-lg">
                    <img className="mx-auto h-25 w-auto" src="/image/logo-ori.png" alt="Origram" />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">친구들의 사진과 동영상을 보려면 가입하세요.</h2>
                    <form className="space-y-6 mt-10" onSubmit={handleNext}>
                        <div>
                            <input
                                required
                                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="아이디"
                                value={state.username}
                                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'username', value: e.target.value })}
                            />
                        </div>
                        <div>
                            <input
                                required
                                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="이메일"
                                value={state.email}
                                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value })}
                            />
                        </div>
                        <div>
                            <input
                                required
                                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="성명"
                                value={state.name}
                                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'name', value: e.target.value })}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="비밀번호"
                                value={state.password}
                                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'password', value: e.target.value })}
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-sky-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                다음
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

export default JoinPage;
