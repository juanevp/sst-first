import {useContext, createContext, Dispatch, SetStateAction} from "react";

export interface AppService {
    isAuthenticated: boolean;
    userHasAuthenticated: Dispatch<SetStateAction<boolean>>;
}

const stub = () => { throw new Error(); }

const defaultAppContext: AppService = {
    isAuthenticated: false,
    userHasAuthenticated: stub,
}

export const AppContext = createContext<AppService>(defaultAppContext);

export const useAppContext = () => {
    return useContext(AppContext);
};
