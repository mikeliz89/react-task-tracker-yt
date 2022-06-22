import { useTranslation } from 'react-i18next';
import WorkPhase from './WorkPhase';

export default function WorkPhases({ workPhases, drinkID, onDeleteWorkPhase }) {

  const { t } = useTranslation('recipe', { keyPrefix: 'recipe' });

  return (
    <>
      <h5>{t('workphases_header')}</h5>
      {workPhases
        ? workPhases.map((workPhase, index) =>
          <WorkPhase
            key={workPhase.id}
            drinkID={drinkID}
            workPhase={workPhase}
            onDeleteWorkPhase={onDeleteWorkPhase}
          />
        ) : ''
      }
    </>
  )
}
