//react
import { useTranslation } from 'react-i18next';
//recipes
import { Incredient } from './Incredient';
//proptypes
import PropTypes from 'prop-types';

export default function Incredients({ dbUrl, translation, incredients, recipeID, onDelete }) {

  //translation
  const { t } = useTranslation(translation, { keyPrefix: translation });

  return (
    <>
      <h5>{t('incredients_header')}</h5>

      {incredients
        ? incredients.map((incredient, index) =>
          <Incredient
            dbUrl={dbUrl}
            translation={translation}
            key={incredient.id}
            incredient={incredient}
            recipeID={recipeID}
            onDelete={onDelete} />
        ) : ''
      }
    </>
  )
}

Incredient.defaultProps = {
  dbUrl: '/none',
  translation: '',
}

Incredient.propTypes = {
  dbUrl: PropTypes.string,
  translation: PropTypes.string,
  recipeID: PropTypes.string,
  onDelete: PropTypes.func
}