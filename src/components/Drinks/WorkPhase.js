//react
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
//recipe
import AddWorkPhase from '../Recipe/AddWorkPhase';
//firebase
import { db } from '../../firebase-config';
import { update, ref } from "firebase/database";
//icon
import Icon from '../Icon';

export default function WorkPhase({ workPhase, drinkID, onDelete }) {

    //constants
    const DB_DRINK_WORKPHASES = '/drink-workphases';
    const TRANSLATION = 'drinks';

    //translation
    const { t } = useTranslation(TRANSLATION, { keyPrefix: TRANSLATION });

    //states
    const [editable, setEditable] = useState(false);

    const updateWorkPhase = (drinkID, newWorkPhase) => {
        const updates = {};
        updates[`${DB_DRINK_WORKPHASES}/${drinkID}/${workPhase.id}`] = newWorkPhase;
        update(ref(db), updates);
        setEditable(false);
    }

    return (
        <div className='drinks'>
            <Row>
                <Col xs={9}>
                    <span style={{ fontWeight: 'bold' }}>{workPhase.name}</span>
                </Col>
                <Col xs={3}>
                    {
                        <span style={{ float: 'right' }}>
                            <Icon name='edit' className="editBtn" style={{ color: 'light-gray', cursor: 'pointer', fontSize: '1.2em' }}
                                onClick={() => editable ? setEditable(false) : setEditable(true)} />
                            <Icon name='times' className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                                onClick={() => onDelete(drinkID, workPhase.id)} />
                        </span>
                    }
                </Col>
            </Row>
            <Row>
                <Col>{workPhase.estimatedLength ? workPhase.estimatedLength : 0} {t('in_minutes')}</Col>
            </Row>
            {editable &&
                <AddWorkPhase
                    dbUrl={DB_DRINK_WORKPHASES}
                    translation={TRANSLATION}
                    workPhaseID={workPhase.id}
                    recipeID={drinkID}
                    onSave={updateWorkPhase}
                    onClose={() => setEditable(false)} />
            }
        </div>
    )
}
