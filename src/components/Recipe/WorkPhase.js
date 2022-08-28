//react
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
//firebase
import { update, ref } from "firebase/database";
import { db } from '../../firebase-config';
//recipes
import AddWorkPhase from './AddWorkPhase';
//icon
import Icon from '../Icon';

export default function WorkPhase({ workPhase, recipeID, onDeleteWorkPhase }) {

    //constants
    const DB_WORKPHASES = '/recipe-workphases';
    const TRANSLATION = 'recipe';

    //translation
    const { t } = useTranslation(TRANSLATION, { keyPrefix: TRANSLATION });

    //states
    const [editable, setEditable] = useState(false);

    const updateWorkPhase = (recipeID, newWorkPhase) => {
        const updates = {};
        updates[`${DB_WORKPHASES}/${recipeID}/${workPhase.id}`] = newWorkPhase;
        update(ref(db), updates);
        setEditable(false);
    }

    return (
        <div className={TRANSLATION}>
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
                                onClick={() => onDeleteWorkPhase(recipeID, workPhase.id)} />
                        </span>
                    }
                </Col>
            </Row>
            <Row>
                <Col>{workPhase.estimatedLength ? workPhase.estimatedLength : 0} {t('in_minutes')}</Col>
            </Row>
            {editable &&
                <AddWorkPhase
                    dbUrl={DB_WORKPHASES}
                    translation={TRANSLATION}
                    workPhaseID={workPhase.id}
                    recipeID={recipeID}
                    onSave={updateWorkPhase}
                    onClose={() => setEditable(false)} />
            }
        </div>
    )
}
