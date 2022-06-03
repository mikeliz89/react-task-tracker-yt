import GoBackButton from '../GoBackButton';
import { useTranslation } from 'react-i18next';

const ManageExercises = () => {

  const { t } = useTranslation('exercises', { keyPrefix: 'exercises' });

  return (
    <div>
      <GoBackButton />
      <h3 className="page-title">{t('manage_exercises_title')}</h3>
      <p className="text-center">{t('coming_soon')}</p>
    </div>
  )
}

export default ManageExercises