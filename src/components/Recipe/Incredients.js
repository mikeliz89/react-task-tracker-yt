import React from 'react'
import { FaTimes} from 'react-icons/fa'

export default function Incredients({incredients, recipeID, onDelete}) {
  return (
      <>
        <h3>Ainesosat</h3>
        {incredients 
          ? incredients.map((incredient, index) =>
          <div>
            <h5>
            {incredient.name} - {incredient.amount} {incredient.unit}
                {  
            <> <FaTimes className="deleteTaskBtn" style={{color:'red', cursor: 'pointer'}} 
                onClick={() => onDelete(recipeID, incredient.id)} />
            </>
            }
            </h5>
        </div>
        ) : ''
        }
      </>
  )
}
