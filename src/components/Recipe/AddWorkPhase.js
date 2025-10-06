import { useTranslation } from 'react-i18next';
import { Form, ButtonGroup, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Button from '../Buttons/Button';
import PropTypes from 'prop-types';
import FormTitle from '../Site/FormTitle';
import { getFromFirebaseByIdAndSubId } from '../../datatier/datatier';
import * as Constants from '../../utils/Constants';

export default function AddWorkPhase({ dbUrl, translation, translationKeyPrefix, workPhaseID, recipeID, onSave, onClose }) {

  //translation
  const { t } = useTranslation(translation, { keyPrefix: translationKeyPrefix });
  const { t: tCommon } = useTranslation(Constants.TRANSLATION_COMMON, { keyPrefix: Constants.TRANSLATION_COMMON });

  //states
  const [name, setName] = useState('');
  const [estimatedLength, setEstimatedLength] = useState(0);

  useEffect(() => {
    if (workPhaseID != null) {
      const getWorkPhase = async () => {
        await fetchWorkPhaseFromFirebase(recipeID, workPhaseID);
      }
      getWorkPhase();
    }
  }, [recipeID, workPhaseID]);

  const fetchWorkPhaseFromFirebase = async (recipeID, workPhaseID) => {
    getFromFirebaseByIdAndSubId(dbUrl, recipeID, workPhaseID).then((val) => {
      setName(val["name"]);
      setEstimatedLength(val["estimatedLength"]);
    });
  }

  const onSubmit = (e) => {
    e.preventDefault();

    //validation
    if (!name) {
      return;
    }

    onSave(recipeID, { name, estimatedLength });

    if (workPhaseID == null) {
      clearForm();
    }
  }

  const clearForm = () => {
    setName('');
    setEstimatedLength(0);
  }

  return (
    <>
      {(workPhaseID === "" || workPhaseID === undefined) &&
        <FormTitle iconName={Constants.ICON_HOURGLASS_1} title={t('add_workphase_formtitle')} />
      }
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
            <Button type='button' text={tCommon('buttons.button_close')} onClick={() => onClose()} className='btn btn-block' />
            <Button type='submit' text={t('button_save_workphase')} className='btn btn-block saveBtn' />
          </ButtonGroup>
        </Row>
      </Form>
    </>
  )
}

AddWorkPhase.defaultProps = {
  dbUrl: '/none',
  translation: '',
}

AddWorkPhase.propTypes = {
  dbUrl: PropTypes.string,
  translation: PropTypes.string,
  recipeID: PropTypes.string,
  workPhaseID: PropTypes.string,
  onSave: PropTypes.func,
  onClose: PropTypes.func
}