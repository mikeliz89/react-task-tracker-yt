//react
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
//firebase
import { update, ref } from "firebase/database";
import { db } from '../../firebase-config';
//recipes
import EditWorkPhase from './EditWorkPhase';
import Icon from '../Icon';

export default function WorkPhase({ workPhase, recipeID, onDeleteWorkPhase }) {

    //constants
    const DB_WORKPHASES = '/recipe-workphases';

    //translation
    const { t } = useTranslation('recipe', { keyPrefix: 'recipe' });

    //states
    const [editable, setEditable] = useState(false);

    const editWorkPhase = (workPhase) => {
        //save
        const updates = {};
        updates[`${DB_WORKPHASES}/${recipeID}/${workPhase.id}`] = workPhase;
        update(ref(db), updates);

        setEditable(false);
    }

    return (
        <div className='recipe'>
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
                <EditWorkPhase
                    workPhaseID={workPhase.id}
                    recipeID={recipeID}
                    onEditWorkPhase={editWorkPhase}
                    onCloseEditWorkPhase={() => setEditable(false)} />
            }
        </div>
    )
}
