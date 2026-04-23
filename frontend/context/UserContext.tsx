import { createContext, ReactNode, useContext, useState } from 'react';

type UserData = {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    ecoPoints: string;
};

type UserContextType = {
    user: UserData;
    setUser: (data: Partial<UserData>) => void;
};

const defaultUser: UserData = { userId: '', firstName: '', lastName: '', email: '', ecoPoints: '' };

const UserContext = createContext<UserContextType>({
    user: defaultUser,
    setUser: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUserState] = useState<UserData>(defaultUser);

    const setUser = (data: Partial<UserData>) => {
        setUserState(prev => ({ ...prev, ...data }));
    };

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
