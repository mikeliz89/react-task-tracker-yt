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

export default function WorkPhase({ workPhase, drinkID, onDeleteWorkPhase }) {

    //translation
    const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

    //states
    const [editable, setEditable] = useState(false);

    const editWorkPhase = (workPhase) => {
        //save
        const updates = {};
        updates[`/drink-workphases/${drinkID}/${workPhase.id}`] = workPhase;
        update(ref(db), updates);

        setEditable(false);
    }

    return (
        <div key={workPhase.id} className='drink'>
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
                                onClick={() => onDeleteWorkPhase(drinkID, workPhase.id)} />
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
