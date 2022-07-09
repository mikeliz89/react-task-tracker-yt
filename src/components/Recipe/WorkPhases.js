//react
import { useTranslation } from 'react-i18next';
//recipes
import WorkPhase from './WorkPhase';

export default function WorkPhases({ workPhases, recipeID, onDeleteWorkPhase }) {

  const { t } = useTranslation('recipe', { keyPrefix: 'recipe' });

  return (
    <>
      <h5>{t('workphases_header')}</h5>
      {workPhases
        ? workPhases.map((workPhase, index) =>
          <WorkPhase
            key={workPhase.id}
            recipeID={recipeID}
            workPhase={workPhase}
            onDeleteWorkPhase={onDeleteWorkPhase}
          />
        ) : ''
      }
    </>
  )
}
