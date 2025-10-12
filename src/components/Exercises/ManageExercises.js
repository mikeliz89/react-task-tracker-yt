import GoBackButton from '../Buttons/GoBackButton';
import NavButton from '../Buttons/NavButton';
import { useTranslation } from 'react-i18next';
import { ButtonGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Exercises from './Exercises';
import PageTitle from '../Site/PageTitle';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import CenterWrapper from '../Site/CenterWrapper';
import PageContentWrapper from '../Site/PageContentWrapper';
import Counter from '../Site/Counter';
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION, VARIANTS } from '../../utils/Constants';
import { removeFromFirebaseById } from '../../datatier/datatier';
import useFetch from '../useFetch';

export default function ManageExercises() {

  //translation
  const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.EXERCISES });
  const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

  //fetch data
  const { data: exercises, setData: setExercises,
    originalData: originalExercises, counter, loading } = useFetch(DB.EXERCISES);

  const deleteExercise = async (id) => {
    removeFromFirebaseById(DB.EXERCISES, id);
  }

  return loading ? (
    <h3>{tCommon("loading")}</h3>
  ) : (
    <PageContentWrapper>

      <PageTitle title={t('manage_exercises_title')} />

      <Row>
        <ButtonGroup>
          <GoBackButton />
          <NavButton to={NAVIGATION.MANAGE_MOVEMENTS}>
            {t('manage_movements_button')}
          </NavButton>
          <NavButton to={NAVIGATION.MANAGE_EXERCISE_LISTS}
            icon={ICONS.LIST_ALT}
          >
            {tCommon('buttons.button_lists')}
          </NavButton>
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
        <Link className="btn btn-primary" to={NAVIGATION.CREATE_EXERCISE}>{t('create_exercise')}</Link>
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