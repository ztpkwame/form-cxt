import './App.css';
import { Form } from './Form';
import React, { useState, Fragment, useEffect } from 'react';
import FormField from './FormField';
import FormButton from './FormButton';
import { required } from './FormValidation'

function App() {
  const [formLoading, setFormLoading] = useState(true)
  const [postData, setPostData] = useState()
  // const [questionList, setQuestionList] = useState([])
  const [fields, setFields] = useState({})

  const formatQuestionFields = (qList) => {
    let qFields = {}

    const setFieldMeta = (fieldObject) => {
      const fieldId = `field_${fieldObject.pk}_${Object.keys(qFields).length + 1}`
      qFields[fieldId] = {
        id: fieldId,
        label: fieldObject.text,
        value: fieldObject?.answer?.answer,
        type: fieldObject.question_type,
        answer: fieldObject?.answer,
        pk: fieldObject.pk,
        validation: { rule: required }
      }
    }

    const nestedQuestionSet = (nestedList) => {
      for(let i = 0; i < (nestedList || []).length; i++){
        setFieldMeta(nestedList[i])
        nestedQuestionSet(nestedList[i].question_set)
      }
    }

    const nestedModuleSet = (nestedList) => {
      for(let i = 0; i < (nestedList || []).length; i++){
        nestedQuestionSet(nestedList[i].question_set)
        nestedModuleSet(nestedList[i].module_set)
      }
    }

    nestedModuleSet(qList)

    return qFields
  }

  useEffect(() => {
    (async function() {
      try{
        const response = await fetch('./question_list.json')
        .then(res => res.json())
        .then(data => [data])
        .catch(err => [])

        // setQuestionList(response)
        setFields(formatQuestionFields(response))
        setFormLoading(false)
      }
      catch(err){
        console.log(err)
      }
    })()
  }, [])

  const formAction = async(values) => {
    let formObject = []

    for(let k in values){
      formObject.push({
        report: 1,
        asset: 2,
        question: fields[k].pk,
        answer: values[k],
        previous_answer: fields[k].answer
      })
    }

    return formObject
  }

  const formActionCallback = (result) => {
    if(result){
      setPostData(result)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        Form using Context API 
      </header>
      {formLoading && (
        <div>Loading...</div>
      )}
      {!formLoading && (
        <Fragment>
          <Form
            action={formAction}
            submitCallback={formActionCallback}
            showErrors={true}
            fields={fields}
            render={() => (
              <Fragment>
                {Object.keys(fields).map((key) => (
                  <FormField key={key} {...fields[key]} />
                ))}
                <FormButton text="Save" />
              </Fragment>
            )}
          />

          <div>
            {postData !== undefined && (
              <Fragment>
                <p>Form Post Data</p>
                <pre>{JSON.stringify(postData, null, 2) }</pre>
              </Fragment>
            )}
          </div>
      </Fragment>
      )}
    </div>
  );
}

export default App;
