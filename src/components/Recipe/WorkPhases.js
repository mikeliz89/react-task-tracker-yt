import { useTranslation } from 'react-i18next';
import WorkPhase from './WorkPhase';
import PropTypes from 'prop-types';

export default function WorkPhases({ dbUrl, translation, translationKeyPrefix, workPhases, recipeID, onDelete }) {

  //translation
  const { t } = useTranslation(translation, { keyPrefix: translationKeyPrefix });

  const calculateEstimatedLengthsSum = (workPhases) => {
    let sum = 0;
    workPhases.forEach(phase => {
      sum += parseInt(phase.estimatedLength);
    });
    return sum;
  }

  return (
    <>
      <h5>{t('workphases_header')}</h5>

      <p>{t('sum_in_minutes')}: {calculateEstimatedLengthsSum(workPhases)}</p>

      {workPhases
        ? workPhases.map((workPhase, index) =>
          <WorkPhase
            dbUrl={dbUrl}
            translation={translation}
            translationKeyPrefix={translationKeyPrefix}
            key={workPhase.id}
            recipeID={recipeID}
            workPhase={workPhase}
            onDelete={onDelete}
          />
        ) : ''
      }
    </>
  )
}

WorkPhases.defaultProps = {
  dbUrl: '/none',
  translation: '',
}

WorkPhases.propTypes = {
  dbUrl: PropTypes.string,
  translation: PropTypes.string,
  recipeID: PropTypes.string,
  onDelete: PropTypes.func
}