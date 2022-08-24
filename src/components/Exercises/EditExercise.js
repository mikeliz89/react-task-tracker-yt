//react
import { Col, Row, Form, ButtonGroup } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
//firebase
import { db } from '../../firebase-config';
import { update, ref } from 'firebase/database';
//buttons
import Button from '../Button';
//utils
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';

function EditExercise({ exerciseID, exercise, onClose }) {

  //constants
  const DB_EXERCISES = '/exercises';

  //states
  const [date, setDate] = useState(''); //todo: laita oletuksena nykypvm
  const [endDate, setEndDate] = useState(''); //todo: laita oletuksena nykypvm
  const [time, setTime] = useState(''); //todo: laita oletuksena nykyinen kellonaika
  const [endTime, setEndTime] = useState('');
  const [created, setCreated] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  //translation
  const { t, ready } = useTranslation('exercises', { keyPrefix: 'exercises' });

  useEffect(() => {
    if (exercise != null) {
      setDate(exercise.date);
      setTime(exercise.time);
      setEndDate(exercise.endDate);
      setEndTime(exercise.endTime);
      setCreated(exercise.created);
      setCreatedBy(exercise.createdBy);
      setCategory(exercise.category);
    }
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();

    saveExercise(exerciseID, { date, time, endDate, endTime, created, createdBy, category });
  }

  /** Add Exercise To Firebase */
  const saveExercise = async (exerciseID, exercise) => {
    try {
      const updates = {};
      exercise["modified"] = getCurrentDateAsJson();
      updates[`${DB_EXERCISES}/${exerciseID}`] = exercise;
      update(ref(db), updates);
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