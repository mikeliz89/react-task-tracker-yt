import { FaTimes, FaEdit } from 'react-icons/fa'
import EditIncredient from './EditIncredient';
import { db } from '../../firebase-config';
import { update, ref } from "firebase/database";
import { useState } from 'react'

export const Incredient = ({incredient, recipeID, onDelete}) => {

    //states
    const [editable, setEditable] = useState(false);

    const editIncredient = (incredient) => {
        //save
        const updates = {};
        updates[`/incredients/${recipeID}/${incredient.id}`] = incredient;
        update(ref(db), updates);

        setEditable(false);
    }

    return (
        <div key={incredient.id} className='recipe'>
        <div className="inner">
        <span>
            {incredient.name} - <b>{incredient.amount} {incredient.unit}</b>
        </span>
        {  
        <span> 
            <FaEdit className="editBtn" style={{color:'light-gray', cursor: 'pointer', fontSize:'20px'}} 
            onClick={() => editable ? setEditable(false) : setEditable(true)} />
            <FaTimes className="deleteBtn" style={{color:'red', cursor: 'pointer'}} 
            onClick={() => onDelete(recipeID, incredient.id)} />
        </span>
        }
        </div>
        { editable && 
        <EditIncredient 
         incredientID={incredient.id} 
         recipeID={recipeID}
         onEditIncredient={editIncredient}
         onCloseEditIncredient={() => setEditable(false)}/>
        }
    </div>
    )
}
