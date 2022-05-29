import {useEffect, useState} from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {LinkContainer} from "react-router-bootstrap";
import {Auth} from "aws-amplify";
import {useNavigate} from "react-router-dom";

import "./App.css";
import Routes from "./Routes";
import {AppContext} from "./lib/contextLib";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
    const [isAuthenticated, userHasAuthenticated] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const nav = useNavigate();

    useEffect(() => {
        onLoad();
    }, []);

    const onLoad = async () => {
        try {
            await Auth.currentSession();
            userHasAuthenticated(true);
        } catch (e) {
            if (e !== "No current user") {
                alert(e);
            }
        }

        setIsAuthenticating(false);
    };

    const handleLogout = async () => {
        await Auth.signOut();
        userHasAuthenticated(false);
        nav("/login");
    };

    if (isAuthenticating) {
        return null;
    }

    return (
        <div className="App container py-3">
            <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
                <LinkContainer to="/">
                    <Navbar.Brand className="font-weight-bold text-muted">Scratch</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Nav activeKey={window.location.pathname}>
                        {isAuthenticated ? (
                            <>
                                <LinkContainer to="/settings">
                                    <Nav.Link>Settings</Nav.Link>
                                </LinkContainer>
                                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                            </>
                        ) : (
                            <>
                                <LinkContainer to="/signup">
                                    <Nav.Link>Signup</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/login">
                                    <Nav.Link>Login</Nav.Link>
                                </LinkContainer>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <ErrorBoundary>
                <AppContext.Provider value={{isAuthenticated, userHasAuthenticated}}>
                    <Routes />
                </AppContext.Provider>
            </ErrorBoundary>
        </div>
    );
}

export default App;
