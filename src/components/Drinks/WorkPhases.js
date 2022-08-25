//react
import { useTranslation } from 'react-i18next';
//drinks
import WorkPhase from './WorkPhase';
//icon
import Icon from '../Icon';

export default function WorkPhases({ workPhases, drinkID, onDelete }) {

  //translation
  const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

  return (
    <>
      <h5>
        <Icon name='hourglass-1' />
        {t('workphases_header')}
      </h5>
      {workPhases
        ? workPhases.map((workPhase, index) =>
          <WorkPhase
            key={workPhase.id}
            drinkID={drinkID}
            workPhase={workPhase}
            onDelete={onDelete}
          />
        ) : ''
      }
    </>
  )
}
