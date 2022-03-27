import React from 'react'
import { FaTimes} from 'react-icons/fa'
import { useTranslation } from 'react-i18next';

export default function Incredients({incredients, recipeID, onDelete}) {

  const { t } = useTranslation();

  return (
      <>
        <h4>{ t('incredients_header')}</h4>
        {incredients 
          ? incredients.map((incredient, index) =>
          <div key={incredient.id}>
            <p>
            {incredient.name} - {incredient.amount} {incredient.unit}
                {  
            <> <FaTimes className="deleteTaskBtn" style={{color:'red', cursor: 'pointer'}} 
                onClick={() => onDelete(recipeID, incredient.id)} />
            </>
            }
            </p>
        </div>
        ) : ''
        }
      </>
  )
}
