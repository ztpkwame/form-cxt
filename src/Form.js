import React, { createContext, Component, Fragment } from "react"

export const FormContext = createContext(undefined)

export class Form extends Component {

    constructor(props){
        super(props)
        
        const values = {}
        const errors = {}
        const errorMessage = undefined
        const loading = false
        const submitSuccess = false

        this.state = {
            values,
            errors,
            errorMessage,
            loading,
            submitSuccess
        }
    }

    validate = (fieldName) => {
        let fieldError = undefined
        const { fields } = this.props
        
        if(fields[fieldName] && fields[fieldName].validation){
            if(fields[fieldName].validation){
                fieldError = fields[fieldName].validation.rule(
                    this.state.values,
                    fieldName,
                    fields[fieldName].validation?.args
                )
            }
        }
        this.setState((prevState) => ({
            ...prevState,
            errorMessage: undefined,
            errors: { ...prevState.errors, [fieldName]: fieldError } 
        }))

        return fieldError
    }

    validateForm = () => {
        const errors = {}
        Object.keys(this.props.fields).forEach((fieldName) => {
            errors[fieldName] = this.validate(fieldName)
        }) 
        return this.setErrors(errors)  
    }

    setErrors = (errors) => {
        this.setState({ errors })
        return !this.hasErrors(errors)
    }

    hasErrors = (errors) => {
        let hasErrors = false
        Object.keys(errors).forEach((key) => {
            if (errors[key]?.length > 0) hasErrors = true
        })
        return hasErrors
    }

    setValues = (values) => {
        this.setState((prevState) => ({
            ...prevState,
            values: { ...prevState.values, ...values } 
        }))
    }

    handleSubmit = async () => {
        if(this.validateForm()){
            let formResponse = null
            try{
                this.setState({ loading: true })
                formResponse = await this.submitForm()
            }
            catch(e){
                this.setState({ submitSuccess: false })
            } finally {
                this.setState({ loading: false, submitSuccess: formResponse?.status })
                if(this.props.submitCallback){
                    this.props.submitCallback(formResponse?.data)
                }
            }
        }
    }

    submitForm = async () => {
        try{
            const response = await this.props.action(this.state.values)

            //TODO handle errors

            return {status: true, data: response}
        }
        catch(err){
            return { status: false, data: null }
        }
    }

    render() {
        const { errorMessage } = this.state
        ,   { render, showErrors } = this.props
        ,    context = {
                ...this.state
                , setValues: this.setValues
                , validate: this.validate
                , setErrors: this.setErrors
                , handleSubmit: this.handleSubmit
            }

        return (
            <FormContext.Provider value={context}>
                <Fragment>
                    {errorMessage !== undefined && showErrors && (
                        <Fragment>
                            <div>{errorMessage}</div>
                        </Fragment>
                    )}
                    {render()}
                </Fragment>
            </FormContext.Provider>
        )
    }
}