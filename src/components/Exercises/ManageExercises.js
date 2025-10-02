import GoBackButton from '../Buttons/GoBackButton';
import { useTranslation } from 'react-i18next';
import { ButtonGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Exercises from './Exercises';
import PageTitle from '../Site/PageTitle';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import CenterWrapper from '../Site/CenterWrapper';
import PageContentWrapper from '../Site/PageContentWrapper';
import Counter from '../Site/Counter';
import * as Constants from '../../utils/Constants';
import { removeFromFirebaseById } from '../../datatier/datatier';
import useFetch from '../useFetch';
import Icon from '../Icon';

export default function ManageExercises() {

  //translation
  const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_EXERCISES });
  const { t: tCommon } = useTranslation(Constants.TRANSLATION_COMMON, {keyPrefix: Constants.TRANSLATION_COMMON});

  //fetch data
  const { data: exercises, setData: setExercises,
    originalData: originalExercises, counter, loading } = useFetch(Constants.DB_EXERCISES);

  const deleteExercise = async (id) => {
    removeFromFirebaseById(Constants.DB_EXERCISES, id);
  }

  return loading ? (
    <h3>{tCommon("loading")}</h3>
  ) : (
    <PageContentWrapper>

      <PageTitle title={t('manage_exercises_title')} />

      <Row>
        <ButtonGroup>
          <GoBackButton />
          <Link to={Constants.NAVIGATION_MANAGE_MOVEMENTS} className='btn btn-primary'>{t('manage_movements_button')}</Link>

          <Link to={Constants.NAVIGATION_MANAGE_EXERCISE_LISTS} className='btn btn-primary'>
            <Icon name={Constants.ICON_LIST_ALT} color={Constants.COLOR_WHITE} />
            {t('manage_exercise_lists_button')}
          </Link>
          
        </ButtonGroup>
      </Row>

      {
        originalExercises != null && originalExercises.length > 0 ? (
          <SearchSortFilter
            onSet={setExercises}
            originalList={originalExercises}
            //search
            showSearchByText={false}
            //sort
            showSortByStarRating={true}
            showSortByCreatedDate={true}
          />
        ) : (<></>)
      }

      <CenterWrapper>
        <Link className="btn btn-primary" to={Constants.NAVIGATION_CREATE_EXERCISE}>{t('create_exercise')}</Link>
      </CenterWrapper>

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