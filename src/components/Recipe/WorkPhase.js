import { useTranslation } from 'react-i18next';
import { FaTimes, FaEdit } from 'react-icons/fa'
import { useState } from 'react'
import EditWorkPhase from './EditWorkPhase';
import { db } from '../../firebase-config';
import { update, ref } from "firebase/database";

export default function WorkPhase({workPhase, recipeID, onDeleteWorkPhase}) {

    const { t } = useTranslation();

    //states
    const [editable, setEditable] = useState(false);

    const editWorkPhase = (workPhase) => {
        //save
        const updates = {};
        updates[`/workphases/${recipeID}/${workPhase.id}`] = workPhase;
        update(ref(db), updates);

        setEditable(false);
    }

    return (
        <div className='recipe'>
            <div className='inner'>
            <span>
                {workPhase.name} - <b>{workPhase.estimatedLength ? workPhase.estimatedLength : 0} {t('in_minutes')}</b>
            </span>
            {  
            <span> 
                <FaEdit className="editBtn" style={{color:'light-gray', cursor: 'pointer', fontSize:'20px'}} 
                onClick={() => editable ? setEditable(false) : setEditable(true)} />        
                <FaTimes className="deleteBtn" style={{color:'red', cursor: 'pointer'}} 
                onClick={() => onDeleteWorkPhase(recipeID, workPhase.id)} />
            </span>
            }
            </div>
            { editable && 
            <EditWorkPhase 
            workPhaseID={workPhase.id} 
            recipeID={recipeID}
            onEditWorkPhase={editWorkPhase}
            onCloseEditWorkPhase={() => setEditable(false)}/>
            }
        </div>
    )
}
