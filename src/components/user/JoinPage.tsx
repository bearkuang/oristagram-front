import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../../context/RegisterContext';
import axios, { AxiosError } from 'axios';

const JoinPage: React.FC = () => {
    const navigate = useNavigate();
    const { state, dispatch } = useRegister();
    const [verificationCode, setVerificationCode] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [errors, setErrors] = useState({ email: '' })

    const [formData, setFormData] = useState({
        email: ''
    });

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else if (countdown === 0) {
            setIsCodeSent(false);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEmailVerified) {
            navigate('/register/birth');
        } else {
            alert('이메일 인증을 완료해주세요.');
        }
    };

    const handleToLogin = () => {
        navigate('/login');
    }

    const checkDuplicateAndSendVerification = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!state.email) {
            alert("이메일 주소를 입력해주세요.");
            return;
        }
        try {
            await axios.post('http://localhost:8000/api/users/check_duplicate/', { email: state.email });
            // 중복이 없는 경우, 인증 코드 전송
            await axios.post('http://localhost:8000/api/users/request_verification/', { email: state.email });
            setIsCodeSent(true);
            setCountdown(180);
            setErrors({ email: '' });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setErrors({ email: error.response.data.cust_email || '이미 가입된 이메일입니다.' });
            }
        }
    };

    const verifyEmail = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/users/verify_email/', {
                email: state.email,
                code: verificationCode
            });
            if (response.data.message === 'Email verified successfully') {
                setIsEmailVerified(true);
                alert('이메일이 성공적으로 인증되었습니다.');
            }
        } catch (error) {
            alert('인증 코드가 올바르지 않습니다. 다시 시도해주세요.');
        }
    };

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
                        <div className="relative h-9">
                            <div className="flex">
                                <input
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="이메일"
                                    value={state.email}
                                    onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value })}
                                />
                                <button
                                    onClick={checkDuplicateAndSendVerification}
                                    disabled={isCodeSent}
                                    className="ml-2 px-3 py-1.5 bg-blue-500 text-white rounded text-sm whitespace-nowrap"
                                >
                                    {isCodeSent ? `${countdown}s` : '인증'}
                                </button>
                            </div>
                            {errors.email && (
                                <p className="absolute bottom-0 left-0 text-red-500 text-sm">{errors.email}</p>
                            )}
                        </div>
                        {isCodeSent && (
                            <div className="flex items-center space-x-2">
                                <input
                                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="인증 코드"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                />
                                <button
                                    onClick={verifyEmail}
                                    className="px-3 py-1.5 bg-green-500 text-white rounded text-sm whitespace-nowrap"
                                >
                                    확인
                                </button>
                            </div>
                        )}
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
