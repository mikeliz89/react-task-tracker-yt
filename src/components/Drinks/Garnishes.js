import { useTranslation } from 'react-i18next';
import Icon from '../Icon';

import Garnish from './Garnish';

import { TRANSLATION, ICONS } from '../../utils/Constants'

export default function Garnishes({ items, drinkID, onDelete }) {

  //translation
  const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.DRINKS });

return (
    <>
      <h5>
        <Icon name={ICONS.LEMON} />
        {t('garnishes_header')}
      </h5>

      {items
        ? items.map((garnish, index) =>
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



