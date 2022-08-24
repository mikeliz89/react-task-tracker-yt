//react
import { useTranslation } from 'react-i18next';
//Drinks
import { Garnish } from './Garnish';
//Icon
import Icon from '../Icon';

export default function Garnishes({ garnishes, drinkID, onDelete }) {

  //translation
  const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

  return (
    <>
      <h5>
        <Icon name='lemon' />
        {t('garnishes_header')}
      </h5>

      {garnishes
        ? garnishes.map((garnish, index) =>
          <Garnish
            key={garnish.id}
            garnish={garnish}
            drinkID={drinkID}
            onDelete={onDelete} />
        ) : ''
      }
    </>
  )
}
