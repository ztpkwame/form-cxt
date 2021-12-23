import React, { useContext } from "react"
import { FormContext } from "./Form"

const FormButton = ({ 
    text,
    className
}) => {
    const context = useContext(FormContext)

    return (
        <button className={className} disabled={context.loading} onClick={() => !context.loading && context.handleSubmit()}>
            {text}
        </button>
    )
}

export default FormButton