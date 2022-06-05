import { FaTimes, FaEdit } from 'react-icons/fa';
import EditIncredient from './EditIncredient';
import { db } from '../../firebase-config';
import { update, ref } from "firebase/database";
import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';

export const Incredient = ({ incredient, recipeID, onDelete }) => {

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
            <Row>
                <Col>
                    <span style={{ fontWeight: 'bold' }}>{incredient.name}</span>
                    {
                        <span style={{ float: 'right' }}>
                            <FaEdit className="editBtn" style={{ color: 'light-gray', cursor: 'pointer', fontSize: '1.4em' }}
                                onClick={() => editable ? setEditable(false) : setEditable(true)} />
                            <FaTimes className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.4em' }}
                                onClick={() => onDelete(recipeID, incredient.id)} />
                        </span>
                    }
                </Col>
            </Row>
            <Row>
                <Col>{incredient.amount} {incredient.unit}</Col>
            </Row>
            {editable &&
                <EditIncredient
                    incredientID={incredient.id}
                    recipeID={recipeID}
                    onEditIncredient={editIncredient}
                    onCloseEditIncredient={() => setEditable(false)} />
            }
        </div>
    )
}
