import {FormEventHandler, useState} from "react";
import Form from "react-bootstrap/Form";
import {Auth} from "aws-amplify";
import {Link} from "react-router-dom";

import "./Login.css";
import {useAppContext} from "../lib/contextLib";
import LoaderButton from "../components/LoaderButton";
import {onError} from "../lib/errorLib";
import {useFormFields} from "../lib/hooksLib";

export default function Login() {
    const {userHasAuthenticated} = useAppContext();
    const [isLoading, setIsLoading] = useState(false);
    const [fields, handleFieldChange] = useFormFields({
        email: "",
        password: "",
    });

    const validateForm = () => {
        return fields.email.length > 0 && fields.password.length > 0;
    };

    const handleSubmit: FormEventHandler<HTMLFormElement> = async event => {
        event.preventDefault();
        setIsLoading(true);
        try {
            await Auth.signIn(fields.email, fields.password);
            userHasAuthenticated(true);
        } catch (e: any) {
            onError(e);
            setIsLoading(false);
        }
    };

    return (
        <div className="Login">
            <Form onSubmit={handleSubmit}>
                <Form.Group /*size="lg"*/ controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control autoFocus type="email" value={fields.email} onChange={handleFieldChange} />
                </Form.Group>
                <Form.Group /*size="lg"*/ controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" value={fields.password} onChange={handleFieldChange} />
                </Form.Group>
                <Link to="/login/reset">Forgot password?</Link>
                <div className="d-grid gap-2">
                    <LoaderButton
                        // block="true"
                        size="lg"
                        type="submit"
                        isLoading={isLoading}
                        disabled={!validateForm()}
                    >
                        Login
                    </LoaderButton>
                </div>
            </Form>
        </div>
    );
}
