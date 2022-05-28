import {cloneElement, FC, ReactElement} from "react";
import {Navigate} from "react-router-dom";
import {useAppContext} from "../lib/contextLib";

function querystring(name: string, url: string = window.location.href) {
    const parsedName = name.replace(/[[]]/g, "\\$&");
    const regex = new RegExp(`[?&]${parsedName}(=([^&#]*)|&|#|$)`, "i");
    const results = regex.exec(url);

    if (!results || !results[2]) {
        return false;
    }

    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export interface UnauthenticatedRouteProps {
    children: ReactElement;
}

const UnauthenticatedRoute: FC<UnauthenticatedRouteProps> = props => {
    const {children} = props;
    const {isAuthenticated} = useAppContext();
    const redirect = querystring("redirect");

    if (isAuthenticated) {
        return <Navigate to={redirect || "/"} />;
    }

    return cloneElement(children, props);
};

export default UnauthenticatedRoute;
