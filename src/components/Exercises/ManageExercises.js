import { useTranslation } from 'react-i18next';
import { TRANSLATION, DB, ICONS, NAVIGATION } from '../../utils/Constants';
import NavButton from '../Buttons/NavButton';
import ManageGeneric from '../Common/ManageGeneric';
import Exercises from './Exercises';

export default function ManageExercises() {
  const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.EXERCISES });
  const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });
  return (
    <ManageGeneric
      dbKey={DB.EXERCISES}
      translationKey={TRANSLATION.EXERCISES}
      ListComponent={Exercises}
      iconName={ICONS.RUNNING}
      title={t('manage_exercises_title')}
      topActions={
        <>
          <NavButton to={NAVIGATION.MANAGE_MOVEMENTS}>
            {t('manage_movements_button')}
          </NavButton>
          <NavButton to={NAVIGATION.MANAGE_EXERCISE_LISTS} icon={ICONS.LIST_ALT}>
            {tCommon('buttons.button_lists')}
          </NavButton>
        </>
      }
      searchSortFilterOptions={{
        showSearchByText: false,
        showSortByStarRating: true,
        showSortByCreatedDate: true,
        showFilterHaveRated: true,
        showSearchByDescription: true
      }}
      centerActions={(
        <a className="btn btn-primary" href={NAVIGATION.CREATE_EXERCISE}>
          {t('create_exercise')}
        </a>
      )}
    />
  );
}


