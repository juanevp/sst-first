import {useState} from "react";
import {API} from "aws-amplify";
import {useNavigate} from "react-router-dom";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";

import {onError} from "../lib/errorLib";
import config from "../config";
import BillingForm, {BillingFormProps} from "../components/BillingForm";
import "./Settings.css";
import {LinkContainer} from "react-router-bootstrap";
import LoaderButton from "../components/LoaderButton";

export default function Settings() {
    const nav = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const stripePromise = loadStripe(config.STRIPE_KEY);

    function billUser(details: any) {
        return API.post("notes", "/billing", {
            body: details,
        });
    }

    const handleFormSubmit: BillingFormProps["onSubmit"] = async (storage, {token, error}) => {
        if (error) {
            onError(error);
            return;
        }

        setIsLoading(true);

        try {
            await billUser({
                storage,
                source: token.id,
            });

            alert("Your card has been charged successfully!");
            nav("/");
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    };

    return (
        <div className="Settings">
            <div className="d-grid gap-2">
                <LinkContainer to="/settings/email">
                    <LoaderButton isLoading={isLoading} size="lg">
                        Change Email
                    </LoaderButton>
                </LinkContainer>
                <LinkContainer to="/settings/password">
                    <LoaderButton isLoading={isLoading} size="lg">
                        Change Password
                    </LoaderButton>
                </LinkContainer>
            </div>
            <hr />
            <Elements
                stripe={stripePromise}
                options={{
                    fonts: [
                        {
                            cssSrc: "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800",
                        },
                    ],
                }}
            >
                <BillingForm isLoading={isLoading} onSubmit={handleFormSubmit} />
            </Elements>
        </div>
    );
}
