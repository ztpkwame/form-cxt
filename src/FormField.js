import React, 
{ 
    useContext, 
    useMemo, 
    useCallback, 
    useEffect, 
    useState
} from "react"
import { FormContext } from "./Form"

const FormField = ({
    id,
    value,
    placeholder,
    type,
    label,
    fieldProps,
}) => {
    const context = useContext(FormContext)
    const [checked, setChecked] = useState(Boolean(value))
    const [fieldValue, setFieldValue] = useState(value)
    const fieldType = (type || '').toLowerCase()

    const handleChange = useCallback(
        (event) => {
            switch(fieldType){
                case 'boolean':
                    setChecked(!checked)
                    break;
                default:
                    setFieldValue(event.target.value)
                    break;
            }
        },
        [fieldType, checked],
    )

    const fieldPropsByType = useCallback(
        () => {
            switch(fieldType){
                case 'integer':
                    return 'number'
                case 'boolean':
                    return 'checkbox'
                default:
                    return fieldType
            }
        },
        [fieldType],
    )

    useEffect(() => {
        if(fieldValue){
            context.setValues({ [id]: fieldValue })
        }
    }, [fieldValue])

    useEffect(() => {
        if(checked !== undefined && fieldType === 'boolean'){
            context.setValues({ [id]: checked })
        }
    }, [checked])

    return useMemo(
        () => (
            <div className="Form-field-container">
                <label>{label}</label>
                <input 
                    id={id} 
                    type={fieldPropsByType()} 
                    value={fieldValue}
                    placeholder={placeholder}
                    checked={checked} 
                    onChange={handleChange}
                    {...fieldProps} 
                />
                {context.errors && context.errors[id] && (
                    <p className="Form-field-error">{context.errors[id]}</p>
                )}
            </div>
        ),
        [
            fieldValue,
            checked,
            id,
            fieldProps,
            placeholder, 
            label,
            fieldPropsByType,
            handleChange,
            context.errors
        ]
    )
}

export default FormField