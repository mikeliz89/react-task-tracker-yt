import { useTranslation } from 'react-i18next';
import { FaTimes, FaEdit } from 'react-icons/fa';
import { useState } from 'react';
import EditWorkPhase from './EditWorkPhase';
import { db } from '../../firebase-config';
import { update, ref } from "firebase/database";
import { Row, Col } from 'react-bootstrap';

export default function WorkPhase({ workPhase, recipeID, onDeleteWorkPhase }) {

    const { t } = useTranslation('recipe', { keyPrefix: 'recipe' });

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
        <div key={workPhase.id} className='recipe'>
            <Row>
                <Col xs={9}>
                    <span style={{ fontWeight: 'bold' }}>{workPhase.name}</span>
                </Col>
                <Col xs={3}>
                    {
                        <span style={{ float: 'right' }}>
                            <FaEdit className="editBtn" style={{ color: 'light-gray', cursor: 'pointer', fontSize: '1.4em' }}
                                onClick={() => editable ? setEditable(false) : setEditable(true)} />
                            <FaTimes className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.4em' }}
                                onClick={() => onDeleteWorkPhase(recipeID, workPhase.id)} />
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
                    recipeID={recipeID}
                    onEditWorkPhase={editWorkPhase}
                    onCloseEditWorkPhase={() => setEditable(false)} />
            }
        </div>
    )
}
