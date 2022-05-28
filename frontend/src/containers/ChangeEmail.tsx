import {FormEventHandler, useState} from "react";
import {Auth} from "aws-amplify";
import {useNavigate} from "react-router-dom";
import {FormText, FormGroup, FormControl, FormLabel} from "react-bootstrap";

import LoaderButton from "../components/LoaderButton";
import {useFormFields} from "../lib/hooksLib";
import {onError} from "../lib/errorLib";
import "./ChangeEmail.css";

export default function ChangeEmail() {
    const nav = useNavigate();
    const [codeSent, setCodeSent] = useState(false);
    const [fields, handleFieldChange] = useFormFields({
        code: "",
        email: "",
    });
    const [isConfirming, setIsConfirming] = useState(false);
    const [isSendingCode, setIsSendingCode] = useState(false);

    function validateEmailForm() {
        return fields.email.length > 0;
    }

    function validateConfirmForm() {
        return fields.code.length > 0;
    }

    const handleUpdateClick: FormEventHandler = async event => {
        event.preventDefault();

        setIsSendingCode(true);

        try {
            const user = await Auth.currentAuthenticatedUser();
            await Auth.updateUserAttributes(user, {email: fields.email});
            setCodeSent(true);
        } catch (error) {
            onError(error);
            setIsSendingCode(false);
        }
    }

    const handleConfirmClick: FormEventHandler = async event => {
        event.preventDefault();

        setIsConfirming(true);

        try {
            await Auth.verifyCurrentUserAttributeSubmit("email", fields.code);

            nav("/settings");
        } catch (error) {
            onError(error);
            setIsConfirming(false);
        }
    }

    const renderUpdateForm = () => (
        <form onSubmit={handleUpdateClick}>
            <FormGroup /*bsSize="large"*/ controlId="email">
                <FormLabel>Email</FormLabel>
                <FormControl autoFocus type="email" value={fields.email} onChange={handleFieldChange} />
            </FormGroup>
            <div className="d-grid gap-2">
                <LoaderButton type="submit" size="lg" isLoading={isSendingCode} disabled={!validateEmailForm()}>
                    Update Email
                </LoaderButton>
            </div>
        </form>
    )

    const renderConfirmationForm = () => (
        <form onSubmit={handleConfirmClick}>
            <FormGroup /*bsSize="large"*/ controlId="code">
                <FormLabel>Confirmation Code</FormLabel>
                <FormControl autoFocus type="tel" value={fields.code} onChange={handleFieldChange} />
                <FormText>Please check your email ({fields.email}) for the confirmation code.</FormText>
            </FormGroup>
            <div className="d-grid gap-2">
                <LoaderButton type="submit" size="lg" isLoading={isConfirming} disabled={!validateConfirmForm()}>
                    Confirm
                </LoaderButton>
            </div>
        </form>
    )

    return <div className="ChangeEmail">{!codeSent ? renderUpdateForm() : renderConfirmationForm()}</div>;
}
