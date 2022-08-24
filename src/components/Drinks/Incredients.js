//react
import { useTranslation } from 'react-i18next';
//Drinks
import { Incredient } from './Incredient';
//icon
import Icon from '../Icon';

export default function Incredients({ incredients, drinkID, onDelete }) {

  //translation
  const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

  return (
    <>
      <h5>
        <Icon name='carrot' />
        {t('incredients_header')}
      </h5>

      {incredients
        ? incredients.map((incredient, index) =>
          <Incredient
            key={incredient.id}
            incredient={incredient}
            drinkID={drinkID}
            onDelete={onDelete} />
        ) : ''
      }
    </>
  )
}
