import React from 'react'
import { useTranslation } from 'react-i18next';
import { Form } from 'react-bootstrap';
import Button from '../../components/Button'
import { useState } from 'react'

export default function AddWorkPhase({ onAddWorkPhase, workPhaseID, recipeID }) {

  const { t } = useTranslation('recipe', { keyPrefix: 'recipe' });

  //states
  const [name, setName] = useState('')
  const [estimatedLength, setEstimatedLength] = useState(0)

  const onSubmit = (e) => {
    e.preventDefault()

    //validation
    if (!name) {
      return
    }

    //call the RecipeDetails.js
    onAddWorkPhase(recipeID, { name, estimatedLength })

    //clear the form
    if (workPhaseID == null) {
      setName('')
      setEstimatedLength(0)
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
      <Form.Group className="mb-3" controlId="addWorkPhaseFormEstimatedLength">
        <Form.Label>{t('workphase_estimated_length')}</Form.Label>
        <Form.Control
          type='number'
          placeholder={t('workphase_estimated_length')}
          value={estimatedLength || ''}
          onChange={(e) => setEstimatedLength(e.target.value)} />
      </Form.Group>
      <Button type='submit' text={t('button_save_workphase')} className='btn btn-block saveBtn' />
    </Form>
  )
}
