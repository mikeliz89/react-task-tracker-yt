//react
import { FaTimes, FaEdit } from 'react-icons/fa';
import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
//firebase
import { db } from '../../firebase-config';
//drinks
import { update, ref } from "firebase/database";
import EditIncredient from './EditIncredient';

export const Incredient = ({ incredient, drinkID, onDelete }) => {

    //states
    const [editable, setEditable] = useState(false);

    const editIncredient = (incredient) => {
        //save
        const updates = {};
        updates[`/drink-incredients/${drinkID}/${incredient.id}`] = incredient;
        update(ref(db), updates);
        setEditable(false);
    }

    return (
        <div key={incredient.id} className='drink'>
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
                                onClick={() => onDelete(drinkID, incredient.id)} />
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
                    drinkID={drinkID}
                    onEditIncredient={editIncredient}
                    onCloseEditIncredient={() => setEditable(false)} />
            }
        </div>
    )
}
