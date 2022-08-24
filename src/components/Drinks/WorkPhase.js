//react
import { useTranslation } from 'react-i18next';
import { FaTimes, FaEdit } from 'react-icons/fa';
import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
//drinks
import EditWorkPhase from './EditWorkPhase';
//firebase
import { db } from '../../firebase-config';
import { update, ref } from "firebase/database";

export default function WorkPhase({ workPhase, drinkID, onDelete }) {

    const DB_DRINK_WORKPHASES = '/drink-workphases';

    //translation
    const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

    //states
    const [editable, setEditable] = useState(false);

    const editWorkPhase = (workPhase) => {
        //save
        const updates = {};
        updates[`${DB_DRINK_WORKPHASES}/${drinkID}/${workPhase.id}`] = workPhase;
        update(ref(db), updates);

        setEditable(false);
    }

    return (
        <div className='drink'>
            <Row>
                <Col xs={9}>
                    <span style={{ fontWeight: 'bold' }}>{workPhase.name}</span>
                </Col>
                <Col xs={3}>
                    {
                        <span style={{ float: 'right' }}>
                            <FaEdit className="editBtn" style={{ color: 'light-gray', cursor: 'pointer', fontSize: '1.2em' }}
                                onClick={() => editable ? setEditable(false) : setEditable(true)} />
                            <FaTimes className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                                onClick={() => onDelete(drinkID, workPhase.id)} />
                        </span>
                    }
                </Col>
            </Row>
            <Row>
                <Col>{workPhase.estimatedLength ? workPhase.estimatedLength : 0} {t('in_minutes')}</Col>
            </Row>
            {editable &&
                <EditWorkPhase
                    workPhaseID={workPhase.id}
                    drinkID={drinkID}
                    onEditWorkPhase={editWorkPhase}
                    onCloseEditWorkPhase={() => setEditable(false)} />
            }
        </div>
    )
}
