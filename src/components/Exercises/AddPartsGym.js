//react
import { useTranslation } from 'react-i18next';

const AddPartsGym = () => {

  //translation  
  const { t } = useTranslation('exercises', { keyPrefix: 'exercises' });

  return (
    <div>
      <h4>{t('gym_parts_header')}</h4>
      Coming soon
    </div>
  )
}

export default AddPartsGym
