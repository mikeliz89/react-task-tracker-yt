import { useTranslation } from 'react-i18next';
import Garnish from './Garnish';
import Icon from '../Icon';
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION, VARIANTS } from '../../utils/Constants'

export default function Garnishes({ garnishes, drinkID, onDelete }) {

  //translation
  const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.DRINKS });

  return (
    <>
      <h5>
        <Icon name={ICONS.LEMON} />
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
