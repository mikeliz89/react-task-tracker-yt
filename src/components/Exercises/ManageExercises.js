import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { removeFromFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB, ICONS, NAVIGATION } from '../../utils/Constants';
import NavButton from '../Buttons/NavButton';
import useFetch from '../Hooks/useFetch';
import ManagePage from '../Site/ManagePage';

import Exercises from './Exercises';

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

  return (
    <ManagePage
      loading={loading}
      loadingText={tCommon("loading")}
      title={t('manage_exercises_title')}
      iconName={ICONS.RUNNING}
      topActions={(
        <>
          <NavButton to={NAVIGATION.MANAGE_MOVEMENTS}>
            {t('manage_movements_button')}
          </NavButton>
          <NavButton to={NAVIGATION.MANAGE_EXERCISE_LISTS}
            icon={ICONS.LIST_ALT}
          >
            {tCommon('buttons.button_lists')}
          </NavButton>
        </>
      )}
      searchSortFilter={{
        onSet: setExercises,
        originalList: originalExercises,
        //search
        showSearchByText: false,
        //sort
        showSortByStarRating: true,
        showSortByCreatedDate: true,
        //filter
        showFilterHaveRated: true,
      }}
      centerActions={
        <Link className="btn btn-primary" to={NAVIGATION.CREATE_EXERCISE}>{t('create_exercise')}</Link>
      }
      hasItems={exercises != null && exercises.length > 0}
      emptyText={t('no_exercises_to_show')}
    >
      <Exercises
        exercises={exercises}
        originalList={originalExercises}
        counter={counter}
        onDelete={deleteExercise}
      />
    </ManagePage>
  )
}


