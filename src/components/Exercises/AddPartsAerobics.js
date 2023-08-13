import { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../Buttons/Button';
import { db } from '../../firebase-config';
import { ref, child, onValue } from 'firebase/database';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import * as Constants from '../../utils/Constants';
import PageTitle from '../Site/PageTitle';
import { pushToFirebaseChild, updateToFirebaseByIdAndSubId } from '../../datatier/datatier';

export default function  AddPartsAerobics () {

  //states
  const [time, setTime] = useState(0);
  const [partID, setPartID] = useState();
  const [loading, setLoading] = useState(true);

  //user
  const { currentUser } = useAuth();

  //params
  const params = useParams();

  //translation  
  const { t } = useTranslation(Constants.TRANSLATION_EXERCISES, { keyPrefix: Constants.TRANSLATION_EXERCISES });

  //load data
  useEffect(() => {
    const getExercisePart = async () => {
      await fetchExercisePartFromFirebase();
    }
    getExercisePart();
  }, [])

  const fetchExercisePartFromFirebase = async () => {
    const dbref = child(ref(db, Constants.DB_EXERCISE_PARTS), params.id);
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
    moving["modified"] = getCurrentDateAsJson();
    updateToFirebaseByIdAndSubId(Constants.DB_EXERCISE_PARTS, exerciseID, partID, moving);
  }

  const save = async (moving) => {
    const exerciseID = params.id;
    moving["created"] = getCurrentDateAsJson();
    moving["createdBy"] = currentUser.email;
    pushToFirebaseChild(Constants.DB_EXERCISE_PARTS, exerciseID, moving);
  }

  return (
    loading ? (
      <h3>{t('loading')}</h3>
    ) : (
      <div>
        <PageTitle title={t('title_aerobics')} iconName={Constants.ICON_CHILD} />
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
