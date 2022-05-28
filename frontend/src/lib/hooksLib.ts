import {ChangeEventHandler, useState} from "react";

export type FormControlElement = HTMLInputElement | HTMLTextAreaElement;

export function useFormFields<T>(initialState: T) {
    const [fields, setValues] = useState(initialState);

    const handler: ChangeEventHandler<FormControlElement> = (event) => {
        setValues({
            ...fields,
            [event.target.id]: event.target.value,
        });
    };

    return [
        fields,
        handler,
    ] as const;
}
