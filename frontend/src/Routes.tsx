import {Route, Routes} from "react-router-dom";

import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import Home from "./containers/Home";
import Login from "./containers/Login";
import NewNote from "./containers/NewNote";
import Notes from "./containers/Notes";
import NotFound from "./containers/NotFound";
import ResetPassword from "./containers/ResetPassword";
import Signup from "./containers/Signup";
import Settings from "./containers/Settings";
import ChangePassword from "./containers/ChangePassword";
import ChangeEmail from "./containers/ChangeEmail";

export default function Links() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route
                path="/login/reset"
                element={
                    <UnauthenticatedRoute>
                        <ResetPassword />
                    </UnauthenticatedRoute>
                }
            />
            <Route
                path="/login"
                element={
                    <UnauthenticatedRoute>
                        <Login />
                    </UnauthenticatedRoute>
                }
            />
            <Route
                path="/signup"
                element={
                    <UnauthenticatedRoute>
                        <Signup />
                    </UnauthenticatedRoute>
                }
            />
            <Route
                path="/settings/password"
                element={
                    <AuthenticatedRoute>
                        <ChangePassword />
                    </AuthenticatedRoute>
                }
            />
            <Route
                path="/settings/email"
                element={
                    <AuthenticatedRoute>
                        <ChangeEmail />
                    </AuthenticatedRoute>
                }
            />
            <Route
                path="/settings"
                element={
                    <AuthenticatedRoute>
                        <Settings />
                    </AuthenticatedRoute>
                }
            />
            <Route
                path="/notes/new"
                element={
                    <AuthenticatedRoute>
                        <NewNote />
                    </AuthenticatedRoute>
                }
            />
            <Route
                path="/notes/:id"
                element={
                    <AuthenticatedRoute>
                        <Notes />
                    </AuthenticatedRoute>
                }
            />{" "}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
