import {FormEventHandler, useState} from "react";
import Form from "react-bootstrap/Form";
import {useNavigate} from "react-router-dom";
import {Auth} from "aws-amplify";

import LoaderButton from "../components/LoaderButton";
import {useAppContext} from "../lib/contextLib";
import {useFormFields} from "../lib/hooksLib";
import {onError} from "../lib/errorLib";
import "./Signup.css";

export default function Signup() {
    const [fields, handleFieldChange] = useFormFields({
        email: "",
        password: "",
        confirmPassword: "",
        confirmationCode: "",
    });
    const nav = useNavigate();
    const [newUser, setNewUser] = useState<any>(null);
    const {userHasAuthenticated} = useAppContext();
    const [isLoading, setIsLoading] = useState(false);

    function validateForm() {
        return fields.email.length > 0 && fields.password.length > 0 && fields.password === fields.confirmPassword;
    }

    function validateConfirmationForm() {
        return fields.confirmationCode.length > 0;
    }

    const handleSubmit: FormEventHandler = async event => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const newUser = await Auth.signUp({
                username: fields.email,
                password: fields.password,
            });
            setNewUser(newUser);
        } catch (e) {
            onError(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmationSubmit: FormEventHandler = async event => {
        event.preventDefault();
        setIsLoading(true);
        try {
            await Auth.confirmSignUp(fields.email, fields.confirmationCode);
            await Auth.signIn(fields.email, fields.password);
            userHasAuthenticated(true);
            nav("/");
        } catch (e) {
            onError(e);
        } finally {
            setIsLoading(false);
        }
    };

    const renderConfirmationForm = () => (
        <Form onSubmit={handleConfirmationSubmit}>
            <Form.Group controlId="confirmationCode" /*size="lg"*/>
                <Form.Label>Confirmation Code</Form.Label>
                <Form.Control autoFocus type="tel" onChange={handleFieldChange} value={fields.confirmationCode} />
                <Form.Text muted>Please check your email for the code.</Form.Text>
            </Form.Group>
            <div className="d-grid gap-2">
                <LoaderButton
                    // block="true"
                    size="lg"
                    type="submit"
                    variant="success"
                    isLoading={isLoading}
                    disabled={!validateConfirmationForm()}
                >
                    Verify
                </LoaderButton>
            </div>
        </Form>
    );

    const renderForm = () => (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="email" /*size="lg"*/>
                <Form.Label>Email</Form.Label>
                <Form.Control autoFocus type="email" value={fields.email} onChange={handleFieldChange} />
            </Form.Group>
            <Form.Group controlId="password" /*size="lg"*/>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={fields.password} onChange={handleFieldChange} />
            </Form.Group>
            <Form.Group controlId="confirmPassword" /*size="lg"*/>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" onChange={handleFieldChange} value={fields.confirmPassword} />
            </Form.Group>
            <div className="d-grid gap-2">
                <LoaderButton
                    // block="true"
                    size="lg"
                    type="submit"
                    variant="success"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                >
                    Signup
                </LoaderButton>
            </div>
        </Form>
    );

    return <div className="Signup">{newUser === null ? renderForm() : renderConfirmationForm()}</div>;
}
