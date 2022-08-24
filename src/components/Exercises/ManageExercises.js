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
//pagetitle
import PageTitle from '../PageTitle';
//searchsortfilter
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';

const ManageExercises = () => {

  const DB_EXERCISES = '/exercises';

  //translation
  const { t } = useTranslation('exercises', { keyPrefix: 'exercises' });

  //states
  const [exercises, setExercises] = useState();
  const [originalExercises, setOriginalExercises] = useState();

  //load data
  useEffect(() => {
    let cancel = false;

    const getExercises = async () => {
      if (cancel) {
        return;
      }
      await fetchExercisesFromFirebase();
    }
    getExercises();

    return () => {
      cancel = true;
    }
  }, [])

  const fetchExercisesFromFirebase = async () => {
    const dbref = await ref(db, DB_EXERCISES);
    onValue(dbref, (snapshot) => {
      const snap = snapshot.val();
      const fromDB = [];
      for (let id in snap) {
        fromDB.push({ id, ...snap[id] });
      }
      setExercises(fromDB);
      setOriginalExercises(fromDB);
    })
  }

  const deleteExercise = async (id) => {
    const dbref = ref(db, `${DB_EXERCISES}/${id}`);
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
      <PageTitle title={t('manage_exercises_title')} />
      <div className="page-content">
        <Link to="/managemovements" className='btn btn-primary'>{t('manage_movements_button')}</Link>
        <p className="text-center">{t('exercises')}</p>
        <SearchSortFilter
          onSet={setExercises}
          originalList={originalExercises}
          showSearch={false}
          showSortByStarRating={true}
          showSortByCreatedDate={true} />
        {
          exercises != null && exercises.length > 0 ? (
            <Exercises exercises={exercises}
              onDelete={deleteExercise} />
          ) : (
            t('no_exercises_to_show')
          )
        }
      </div>

    </div>
  )
}

export default ManageExercises