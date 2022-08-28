//react
import { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
//buttons
import Button from '../Button';
//firebase
import { db } from '../../firebase-config';
import { push, ref, child, update, onValue } from 'firebase/database';
//auth
import { useAuth } from '../../contexts/AuthContext';
//utils
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
//pagetitle
import PageTitle from '../PageTitle';

const AddPartsAerobics = () => {

  const DB_EXERCISE_PARTS = '/exercise-parts';

  //states
  const [time, setTime] = useState(0);
  const [partID, setPartID] = useState();
  const [loading, setLoading] = useState(true);

  //user
  const { currentUser } = useAuth();

  //params
  const params = useParams();

  //translation  
  const { t } = useTranslation('exercises', { keyPrefix: 'exercises' });

  //load data
  useEffect(() => {
    const getExercisePart = async () => {
      await fetchExercisePartFromFirebase();
    }
    getExercisePart();
  }, [])

  const fetchExercisePartFromFirebase = async () => {
    const dbref = child(ref(db, DB_EXERCISE_PARTS), params.id);
    onValue(dbref, (snapshot) => {
      const val = snapshot.val();
      const fromDB = [];
      if (val === null) {
        setLoading(false);
        return;
      }
      for (let id in val) {
        fromDB.push({ id, ...val[id] });
      }
      if (fromDB && fromDB.length > 0) {
        setPartID(fromDB[0]["id"]);
        setTime(fromDB[0]["time"]);
      }
      setLoading(false);
    })
  }

  const onSubmit = (e) => {
    e.preventDefault();

    const moving = { time };
    if (!partID) {
      save(moving);
    } else {
      moving["id"] = partID;
      updateMoving(moving, partID);
    }
  }

  const updateMoving = async (moving, partID) => {
    const exerciseID = params.id;
    const updates = {};
    moving["modified"] = getCurrentDateAsJson();
    updates[`${DB_EXERCISE_PARTS}/${exerciseID}/${partID}`] = moving;
    update(ref(db), updates);
  }

  const save = async (moving) => {
    const exerciseID = params.id;
    moving["created"] = getCurrentDateAsJson();
    moving["createdBy"] = currentUser.email;
    const dbref = child(ref(db, DB_EXERCISE_PARTS), exerciseID);
    push(dbref, moving);
  }

  return (
    loading ? (
      <h3>{t('loading')}</h3>
    ) : (
      <div>
        <PageTitle title={t('title_aerobics')} iconName='child' />
        <Form onSubmit={onSubmit}>
          <Form.Group>
            <Form.Label>{t('time')}</Form.Label>
            <Form.Control type='text'
              value={time}
              onChange={(e) => setTime(e.target.value)}></Form.Control>
          </Form.Group>
          <Button disabled={loading} type='submit' text={t('button_save')} />
        </Form>
      </div>
    )
  )
}

export default AddPartsAerobics