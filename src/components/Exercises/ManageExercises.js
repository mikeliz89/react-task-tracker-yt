//buttons
import GoBackButton from '../GoBackButton';
//react
import { useTranslation } from 'react-i18next';
import { ButtonGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
//exercises
import Exercises from './Exercises';
//firebase
import { db } from '../../firebase-config';
import { onValue, ref, remove } from 'firebase/database';

const ManageExercises = () => {

  //translation
  const { t } = useTranslation('exercises', { keyPrefix: 'exercises' });

  //states
  const [exercises, setExercises] = useState();

  //load data
  useEffect(() => {
    let cancel = false;

    const getExercises = async () => {
      if (cancel) {
        return;
      }
      await fetchExercisesFromFirebase()
    }
    getExercises();

    return () => {
      cancel = true;
    }
  }, [])

  /** Fetch Recipes From Firebase */
  const fetchExercisesFromFirebase = async () => {
    const dbref = await ref(db, '/exercises');
    onValue(dbref, (snapshot) => {
      const snap = snapshot.val();
      const fromDB = [];
      for (let id in snap) {
        fromDB.push({ id, ...snap[id] });
      }
      setExercises(fromDB);
    })
  }

  const deleteExercise = async (id) => {
    const dbref = ref(db, `/exercises/${id}`);
    remove(dbref)
  }

  return (
    <div>
      <Row>
        <ButtonGroup>
          <GoBackButton />
          <Link className="btn btn-primary" to={`/createexercise`}>{t('create_exercise')}</Link>
        </ButtonGroup>
      </Row>
      <h3 className="page-title">{t('manage_exercises_title')}</h3>
      <p className="text-center">{t('exercises')}</p>
      {
        exercises != null && exercises.length > 0 ? (
          <Exercises exercises={exercises}
            onDelete={deleteExercise} />
        ) : (
          t('no_exercises_to_show')
        )
      }
    </div>
  )
}

export default ManageExercises