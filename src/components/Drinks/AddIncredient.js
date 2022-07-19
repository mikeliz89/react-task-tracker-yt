//react
import { useTranslation } from 'react-i18next';
import { Form, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
//buttons
import Button from '../../components/Button';

export default function AddIncredient({ onAddIncredient, incredientID, drinkID }) {

  //translation
  const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

  //states
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [amount, setAmount] = useState(0);

  const onSubmit = (e) => {
    e.preventDefault();

    //validation
    if (!name) {
      return;
    }

    //call the RecipeDetails.js
    onAddIncredient(drinkID, { name, unit, amount });

    //clear the form
    if (incredientID == null) {
      setName('');
      setUnit('');
      setAmount(0);
    }
  }

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group className="mb-3" controlId="addIncredientForm-Name">
        <Form.Label>{t('incredient_name')}</Form.Label>
        <Form.Control
          autoComplete="off"
          type='text'
          placeholder={t('incredient_name')}
          value={name}
          onChange={(e) => setName(e.target.value)} />
      </Form.Group>
      <Row>
        <Form.Group as={Col} className="mb-3" controlId="addIncredientForm-Amount">
          <Form.Label>{t('incredient_amount')}</Form.Label>
          <Form.Control
            autoComplete="off"
            type='number'
            placeholder={t('incredient_amount')}
            value={amount}
            onChange={(e) => setAmount(e.target.value)} />
        </Form.Group>
        <Form.Group as={Col} className="mb-3" controlId="addIncredientForm-Unit">
          <Form.Label>{t('incredient_unit_label')}</Form.Label>
          <Form.Control
            autoComplete="off"
            type='text'
            placeholder={t('incredient_unit')}
            value={unit}
            onChange={(e) => setUnit(e.target.value)} />
        </Form.Group>
      </Row>
      <Button type='submit' text={t('button_save_incredient')} className='btn btn-block saveBtn' />
    </Form>
  )
}
