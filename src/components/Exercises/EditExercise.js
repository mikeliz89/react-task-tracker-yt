import { Col, Row, Form, ButtonGroup } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../Button';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import * as Constants from '../../utils/Constants';
import { updateToFirebaseById } from '../../datatier/datatier';

function EditExercise({ exerciseID, exercise, onClose }) {

  //states
  const [date, setDate] = useState(''); //todo: laita oletuksena nykypvm
  const [endDate, setEndDate] = useState(''); //todo: laita oletuksena nykypvm
  const [time, setTime] = useState(''); //todo: laita oletuksena nykyinen kellonaika
  const [endTime, setEndTime] = useState('');
  const [created, setCreated] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [stars, setStars] = useState(0);
  const [description, setDescription] = useState('');

  //translation
  const { t, ready } = useTranslation(Constants.TRANSLATION_EXERCISES, { keyPrefix: Constants.TRANSLATION_EXERCISES });

  useEffect(() => {
    if (exercise != null) {
      setCategory(exercise.category);
      setCreated(exercise.created);
      setCreatedBy(exercise.createdBy);
      setDate(exercise.date);
      setDescription(exercise.description);
      setEndDate(exercise.endDate);
      setEndTime(exercise.endTime);
      setStars(exercise.stars);
      setTime(exercise.time);
    }
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    saveExercise(exerciseID, { category, created, createdBy, date, description, endDate, endTime, stars, time });
  }

  const saveExercise = async (exerciseID, exercise) => {
    try {
      exercise["modified"] = getCurrentDateAsJson();
      updateToFirebaseById(Constants.DB_EXERCISES, exerciseID, exercise);
    } catch (ex) {
      setError(t('exercise_save_exception'));
    }
  }

  return (
    <Form onSubmit={onSubmit}>
      <Row>
        <Form.Group as={Col} className="mb-3">
          <Form.Label>{t('startdate')}</Form.Label>
          <Form.Control type="date" name='date' value={date} onChange={(e) => setDate(e.target.value)} />
        </Form.Group>
        <Form.Group as={Col} className="mb-3">
          <Form.Label>{t('starttime')}</Form.Label>
          <Form.Control type="time" name='time' value={time} onChange={(e) => setTime(e.target.value)} />
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col} className="mb-3">
          <Form.Label>{t('enddate')}</Form.Label>
          <Form.Control type="date" name='date' value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </Form.Group>
        <Form.Group as={Col} className="mb-3">
          <Form.Label>{t('endtime')}</Form.Label>
          <Form.Control type="time" name='time' value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </Form.Group>
      </Row>
      <Form.Group className="mb-3" controlId="addDrinkForm-Description">
        <Form.Label>{t('description')}</Form.Label>
        <Form.Control type='text'
          autoComplete="off"
          placeholder={t('description')}
          value={description}
          onChange={(e) => setDescription(e.target.value)} />
      </Form.Group>
      <Row>
        <ButtonGroup>
          <Button type='button' text={t('close')} className='btn btn-block' onClick={() => onClose()} />
          <Button type='submit' text={t('button_save_exercise')} className='btn btn-block saveBtn' />
        </ButtonGroup>
      </Row>
    </Form>
  )
}

export default EditExercise