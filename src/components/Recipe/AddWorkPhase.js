import React from 'react'
import { useTranslation } from 'react-i18next';
import { Form } from 'react-bootstrap';
import Button from '../../components/Button'
import { useState } from 'react'

export default function AddWorkPhase({onAddWorkPhase, workPhaseID, recipeID}) {

  const { t } = useTranslation();

  //states
  const [name, setName] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()

    //validation
    if(!name) {
        return
    }

    //call the RecipeDetails.js
    onAddWorkPhase( recipeID, { name })

    //clear the form
    if(workPhaseID == null) {
        setName('')
    }
}

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group className="mb-3" controlId="addWorkPhaseFormName">
          <Form.Label>{t('workphase_name')}</Form.Label>
          <Form.Control 
          type='text' 
          placeholder={t('workphase_name')} 
          value={name} 
          onChange={(e) => setName(e.target.value)} />
      </Form.Group>
      <Button type='submit' text={t('button_save_workphase')} className='btn btn-block' />
    </Form>
  )
}
