import { useTranslation } from 'react-i18next';
import { Garnish } from './Garnish';
import Icon from '../Icon';
import * as Constants from '../../utils/Constants'

export default function Garnishes({ garnishes, drinkID, onDelete }) {

  //translation
  const { t } = useTranslation(Constants.TRANSLATION_DRINKS, { keyPrefix: Constants.TRANSLATION_DRINKS });

  return (
    <>
      <h5>
        <Icon name={Constants.ICON_LEMON} />
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
