//react
import { FaTimes, FaEdit } from 'react-icons/fa';
import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
//firebase
import { db } from '../../firebase-config';
import { update, ref } from "firebase/database";
//recipe
import EditIncredient from './EditIncredient';

export const Incredient = ({ incredient, recipeID, onDelete }) => {

    const DB_INCREDIENTS = '/recipe-incredients';

    //states
    const [editable, setEditable] = useState(false);

    const editIncredient = (incredient) => {
        //save
        const updates = {};
        updates[`${DB_INCREDIENTS}/${recipeID}/${incredient.id}`] = incredient;
        update(ref(db), updates);

        setEditable(false);
    }

    return (
        <div className='recipe'>
            <Row>
                <Col xs={9}>
                    <span style={{ fontWeight: 'bold' }}>{incredient.name}</span>
                </Col>
                <Col xs={3}>
                    {
                        <span style={{ float: 'right' }}>
                            <FaEdit className="editBtn" style={{ color: 'light-gray', cursor: 'pointer', fontSize: '1.2em' }}
                                onClick={() => editable ? setEditable(false) : setEditable(true)} />
                            <FaTimes className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
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
