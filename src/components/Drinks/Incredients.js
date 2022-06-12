//react
import { useTranslation } from 'react-i18next';
//Drinks
import { Incredient } from './Incredient';

export default function Incredients({ incredients, drinkID, onDelete }) {

  const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

  return (
    <>
      <h5>{t('incredients_header')}</h5>

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
