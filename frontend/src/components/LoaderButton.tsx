import React from "react";
import Button, { ButtonProps } from "react-bootstrap/Button";
import {BsArrowRepeat} from "react-icons/bs";
import "./LoaderButton.css";

export interface LoaderButtonProps extends ButtonProps {
    isLoading: boolean;
}

const LoaderButton = (props: LoaderButtonProps) => {
    const {isLoading, className = "", disabled = false, ...rest} = props;
    return (
        <Button disabled={disabled || isLoading} className={`LoaderButton ${className}`} {...rest}>
            {isLoading && <BsArrowRepeat className="spinning" />}
            {props.children}
        </Button>
    );
}

export default LoaderButton;