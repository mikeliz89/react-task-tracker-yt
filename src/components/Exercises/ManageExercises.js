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
//ScrollToTop
import ScrollToTop from '../ScrollToTop';
//center
import CenterWrapper from '../CenterWrapper';
import PageContentWrapper from '../PageContentWrapper';

const ManageExercises = () => {

  const DB_EXERCISES = '/exercises';

  //translation
  const { t } = useTranslation('exercises', { keyPrefix: 'exercises' });

  //states
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(0);
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
      let counterTemp = 0;
      for (let id in snap) {
        counterTemp++;
        fromDB.push({ id, ...snap[id] });
      }
      setCounter(counterTemp);
      setExercises(fromDB);
      setOriginalExercises(fromDB);
      setLoading(false);
    })
  }

  const deleteExercise = async (id) => {
    const dbref = ref(db, `${DB_EXERCISES}/${id}`);
    remove(dbref)
  }

  const getCounterText = () => {
    if (originalExercises === undefined) {
      return;
    }
    return exercises.length < originalExercises.length ? exercises.length + '/' + counter : counter + '';
  }

  return loading ? (
    <h3>{t('loading')}</h3>
  ) : (
    <div>
      <Row>
        <ButtonGroup>
          <GoBackButton />
          <Link className="btn btn-primary" to={`/createexercise`}>{t('create_exercise')}</Link>
        </ButtonGroup>
      </Row>
      <PageTitle title={t('manage_exercises_title')} />
      <PageContentWrapper>
        <Link to="/managemovements" className='btn btn-primary'>{t('manage_movements_button')}</Link>
        <CenterWrapper>
          {t('exercises')}
        </CenterWrapper>
        <SearchSortFilter
          onSet={setExercises}
          originalList={originalExercises}
          showSearch={false}
          showSortByStarRating={true}
          showSortByCreatedDate={true} />
        {
          exercises != null && exercises.length > 0 ? (
            <>
              <CenterWrapper>
                {getCounterText()}
              </CenterWrapper>
              <Exercises exercises={exercises}
                onDelete={deleteExercise} />
            </>
          ) : (
            t('no_exercises_to_show')
          )
        }
      </PageContentWrapper>
      <ScrollToTop />
    </div>
  )
}

export default ManageExercises