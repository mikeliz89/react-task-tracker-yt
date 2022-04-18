import React from 'react'
import { FaTimes} from 'react-icons/fa'
import { useTranslation } from 'react-i18next';

export default function Incredients({incredients, recipeID, onDelete}) {

  const { t } = useTranslation();

  return (
      <>
        <h5>{ t('incredients_header')}</h5>

        {incredients 
          ? incredients.map((incredient, index) =>
          <div key={incredient.id} className='recipe'>
            <div className="inner">
              <span>
                {incredient.name} - <b>{incredient.amount} {incredient.unit}</b>
              </span>
              {  
              <> <FaTimes className="deleteBtn" style={{color:'red', cursor: 'pointer'}} 
                  onClick={() => onDelete(recipeID, incredient.id)} />
              </>
              }
            </div>
          </div>
        ) : ''
        }
      </>
  )
}
