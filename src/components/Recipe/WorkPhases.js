import React from 'react'
import { FaTimes} from 'react-icons/fa'
import { useTranslation } from 'react-i18next';

export default function WorkPhases({workPhases, recipeID, onDeleteWorkPhase}) {

  const { t } = useTranslation();

  return (
      <>
        <h5>{ t('workphases_header')}</h5>
        {workPhases 
          ? workPhases.map((workPhase, index) =>
          <div key={workPhase.id}>
            <p>
            {workPhase.name} - {workPhase.estimatedLength} {t('in_minutes')}
                {  
            <> <FaTimes className="deleteTaskBtn" style={{color:'red', cursor: 'pointer'}} 
                onClick={() => onDeleteWorkPhase(recipeID, workPhase.id)} />
            </>
            }
            </p>
        </div>
        ) : ''
        }
      </>
  )
}
