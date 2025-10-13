import { useTranslation } from 'react-i18next';
import { Form, Row, Col, ButtonGroup } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Button from '../Buttons/Button';
import PropTypes from 'prop-types';
import FormTitle from '../Site/FormTitle';
import useFetchByIdAndSubId from '../Hooks/useFetchByIdAndSubId';
import { TRANSLATION, ICONS } from '../../utils/Constants';

export default function AddIncredient({ dbUrl, translation, translationKeyPrefix, onSave, incredientID, recipeID, onClose }) {

  //translation
  const { t } = useTranslation(translation, { keyPrefix: translationKeyPrefix });
  const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

  //states
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [amount, setAmount] = useState(0);

  //load data
  const incredientData = useFetchByIdAndSubId(dbUrl, recipeID, incredientID);

  useEffect(() => {
    if (incredientData) {
      setName(incredientData.name || '');
      setUnit(incredientData.unit || '');
      setAmount(incredientData.amount || 0);
    }
  }, [incredientData]);

  const onSubmit = (e) => {
    e.preventDefault();

    //validation
    if (!name) {
      return;
    }

    onSave(recipeID, { name, unit, amount });

    if (incredientID == null) {
      clearForm();
    }
  }

  const clearForm = () => {
    setName('');
    setUnit('');
    setAmount(0);
  }

  return (
    <>
      {(incredientID === "" || incredientID === undefined) &&
        <FormTitle iconName={ICONS.CARROT} title={t('add_incredient_formtitle')} />
      }
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="addIncredientFormName">
          <Form.Label>{t('incredient_name')}</Form.Label>
          <Form.Control
            autoComplete="off"
            type='text'
            placeholder={t('incredient_name')}
            value={name}
            onChange={(e) => setName(e.target.value)} />
        </Form.Group>
        <Row>
          <Form.Group as={Col} className="mb-3" controlId="addIncredientFormAmount">
            <Form.Label>{t('incredient_amount')}</Form.Label>
            <Form.Control
              autoComplete="off"
              type='number'
              placeholder={t('incredient_amount')}
              value={amount}
              onChange={(e) => setAmount(e.target.value)} />
          </Form.Group>
          <Form.Group as={Col} className="mb-3" controlId="addIncredientFormUnit">
            <Form.Label>{t('incredient_unit_label')}</Form.Label>
            <Form.Control
              autoComplete="off"
              type='text'
              placeholder={t('incredient_unit')}
              value={unit}
              onChange={(e) => setUnit(e.target.value)} />
          </Form.Group>
        </Row>
        <Row>
          <ButtonGroup>
            <Button type='button' onClick={() => onClose()} className='btn btn-block' text={tCommon('buttons.button_close')} />
            <Button type='submit' text={t('button_save_incredient')} className='btn btn-block saveBtn' />
          </ButtonGroup>
        </Row>
      </Form>
    </>
  )
}

AddIncredient.defaultProps = {
  dbUrl: '/none',
  translation: '',
}

AddIncredient.propTypes = {
  dbUrl: PropTypes.string,
  translation: PropTypes.string,
  recipeID: PropTypes.string,
  onDelete: PropTypes.func
}