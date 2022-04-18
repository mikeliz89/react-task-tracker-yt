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
          <div key={workPhase.id} className='recipe'>
            <div className='inner'>
              <span>
                {workPhase.name} - <b>{workPhase.estimatedLength ? workPhase.estimatedLength : 0} {t('in_minutes')}</b>
              </span>
              {  
              <> <FaTimes className="deleteBtn" style={{color:'red', cursor: 'pointer'}} 
                  onClick={() => onDeleteWorkPhase(recipeID, workPhase.id)} />
              </>
              }
            </div>
          </div>
        ) : ''
        }
      </>
  )
}
