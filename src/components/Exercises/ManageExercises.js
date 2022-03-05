import GoBackButton from '../GoBackButton';
import { useTranslation } from 'react-i18next';

const ManageExercises = () => {

  const { t } = useTranslation();

  return (
    <div>
      <h3 className="page-title">{t('manage_exercises_title')}</h3>
       <GoBackButton  />
       <p class="text-center">{t('manage_exercises_coming_soon')}</p>
    </div>
  )
}

export default ManageExercises