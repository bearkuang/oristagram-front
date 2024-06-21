import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface RegisterState {
    username: string;
    email: string;
    password: string;
    name: string;
    birth_date: string;
    profile_picture: File | null;
    website: string;
    bio: string;
}

const initialState: RegisterState = {
    username: '',
    email: '',
    password: '',
    name: '',
    birth_date: '',
    profile_picture: null,
    website: '',
    bio: '',
};

type RegisterAction = 
    | { type: 'SET_FIELD'; field: keyof RegisterState; value: string }
    | { type: 'SET_PROFILE_PICTURE'; file: File | null };

const registerReducer = (state: RegisterState, action: RegisterAction): RegisterState => {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };
        case 'SET_PROFILE_PICTURE':
            return { ...state, profile_picture: action.file };
        default:
            return state;
    }
};

const RegisterContext = createContext<{
    state: RegisterState;
    dispatch: React.Dispatch<RegisterAction>;
}>({ state: initialState, dispatch: () => null });

export const RegisterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(registerReducer, initialState);

    return (
        <RegisterContext.Provider value={{ state, dispatch }}>
            {children}
        </RegisterContext.Provider>
    );
};

export const useRegister = () => useContext(RegisterContext);
