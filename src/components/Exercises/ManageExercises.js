import GoBackButton from '../Buttons/GoBackButton';
import { useTranslation } from 'react-i18next';
import { ButtonGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Exercises from './Exercises';
import { db } from '../../firebase-config';
import { onValue, ref } from 'firebase/database';
import PageTitle from '../Site/PageTitle';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import CenterWrapper from '../Site/CenterWrapper';
import PageContentWrapper from '../Site/PageContentWrapper';
import Counter from '../Site/Counter';
import * as Constants from '../../utils/Constants';
import { removeFromFirebaseById } from '../../datatier/datatier';

const ManageExercises = () => {

  //translation
  const { t } = useTranslation(Constants.TRANSLATION_EXERCISES, { keyPrefix: Constants.TRANSLATION_EXERCISES });

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
    const dbref = await ref(db, Constants.DB_EXERCISES);
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
    removeFromFirebaseById(Constants.DB_EXERCISES, id);
  }

  return loading ? (
    <h3>{t('loading')}</h3>
  ) : (
    <PageContentWrapper>
      <Row>
        <ButtonGroup>
          <GoBackButton />
          <Link className="btn btn-primary" to={`/createexercise`}>{t('create_exercise')}</Link>
        </ButtonGroup>
      </Row>
      <PageTitle title={t('manage_exercises_title')} />

      <Link to={Constants.NAVIGATION_MANAGE_MOVEMENTS} className='btn btn-primary'>{t('manage_movements_button')}</Link>
      <CenterWrapper>
        {t('exercises')}
      </CenterWrapper>

      {
        originalExercises != null && originalExercises.length > 0 ? (
          <SearchSortFilter
            onSet={setExercises}
            originalList={originalExercises}
            //search
            showSearch={false}
            //sort
            showSortByStarRating={true}
            showSortByCreatedDate={true}
          />
        ) : (<></>)
      }

      {
        exercises != null && exercises.length > 0 ? (
          <>
            <Counter list={exercises} originalList={originalExercises} counter={counter} />
            <Exercises exercises={exercises}
              onDelete={deleteExercise} />
          </>
        ) : (
          <>
            <CenterWrapper>
              {t('no_exercises_to_show')}
            </CenterWrapper>
          </>
        )
      }
    </PageContentWrapper>
  )
}

export default ManageExercises