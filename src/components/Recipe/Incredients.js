import { useTranslation } from 'react-i18next';
import Incredient from './Incredient';
import PropTypes from 'prop-types';

export default function Incredients({ dbUrl, translation, translationKeyPrefix, incredients, recipeID, onDelete }) {

  //translation
  const { t } = useTranslation(translation, { keyPrefix: translationKeyPrefix });

  return (
    <>
      <h5>{t('incredients_header')}</h5>

      {incredients
        ? incredients.map((incredient, index) =>
          <Incredient
            dbUrl={dbUrl}
            translation={translation}
            translationKeyPrefix={translationKeyPrefix}
            key={incredient.id}
            incredient={incredient}
            recipeID={recipeID}
            onDelete={onDelete} />
        ) : ''
      }
    </>
  )
}

Incredients.defaultProps = {
  dbUrl: '/none',
  translation: '',
}

Incredients.propTypes = {
  dbUrl: PropTypes.string,
  translation: PropTypes.string,
  recipeID: PropTypes.string,
  onDelete: PropTypes.func
}