//react
import { useTranslation } from 'react-i18next';
import { Form, Row, ButtonGroup } from 'react-bootstrap';
import { useState } from 'react';
//buttons
import Button from '../../components/Button';

export default function AddWorkPhase({ onAddWorkPhase, workPhaseID, drinkID, onClose }) {

  const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

  //states
  const [name, setName] = useState('')
  const [estimatedLength, setEstimatedLength] = useState(0)

  const onSubmit = (e) => {
    e.preventDefault()

    //validation
    if (!name) {
      return
    }

    onAddWorkPhase(drinkID, { name, estimatedLength })

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
          autoComplete="off"
          type='text'
          placeholder={t('workphase_name')}
          value={name}
          onChange={(e) => setName(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="addWorkPhaseFormEstimatedLength">
        <Form.Label>{t('workphase_estimated_length')}</Form.Label>
        <Form.Control
          autoComplete="off"
          type='number'
          placeholder={t('workphase_estimated_length')}
          value={estimatedLength || ''}
          onChange={(e) => setEstimatedLength(e.target.value)} />
      </Form.Group>
      <Row>
        <ButtonGroup>
          <Button type='button' text={t('button_close')} className='btn btn-block'
            onClick={() => onClose()} />
          <Button type='submit' text={t('button_save_workphase')} className='btn btn-block saveBtn' />
        </ButtonGroup>
      </Row>
    </Form>
  )
}
