export const required = (
    values,
    fieldName
) => values[fieldName] === undefined ||
     values[fieldName] === null ||
     values[fieldName] === '' ||
     (typeof values[fieldName] === 'string' &&
        values[fieldName].replace(/\s/g, '') === ''
     )
     ? `This field is required`
     : undefined

export const maxLength = (
    values,
    fieldName,
    length
) => values[fieldName] && values[fieldName].length > length
    ? `This field can not exceed ${length} characters`
    : undefined

export const minLength = (
    values,
    fieldName,
    length
) => values[fieldName] && values[fieldName].length < length
    ? `This field must be atleast ${length} characters`
    : undefined
    