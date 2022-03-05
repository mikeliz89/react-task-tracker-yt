import GoBackButton from '../GoBackButton';
import { useTranslation } from 'react-i18next';

const ManageRecipes = () => {

  const { t } = useTranslation();

  return (
    <div>
      <h3 className="page-title">{t('manage_recipes_title')}</h3>
       <GoBackButton  />
       <p class="text-center">{t('manage_recipes_coming_soon')}</p>
    </div>
  )
}

export default ManageRecipes