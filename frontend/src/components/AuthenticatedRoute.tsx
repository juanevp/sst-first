import {FC, ReactElement} from "react";
import {Navigate, useLocation} from "react-router-dom";
import {useAppContext} from "../lib/contextLib";

export interface AuthenticatedRouteProps {
    children: ReactElement;
}

const AuthenticatedRoute: FC<AuthenticatedRouteProps> = ({children}) => {
    const {pathname, search} = useLocation();
    const {isAuthenticated} = useAppContext();

    if (!isAuthenticated) {
        return <Navigate to={`/login?redirect=${pathname}${search}`} />;
    }

    return children;
};

export default AuthenticatedRoute;
