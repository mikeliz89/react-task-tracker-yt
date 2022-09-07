import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { update, ref } from "firebase/database";
import { db } from '../../firebase-config';
import AddWorkPhase from './AddWorkPhase';
import Icon from '../Icon';
import PropTypes from 'prop-types';

export default function WorkPhase({ dbUrl, translation, workPhase, recipeID, onDelete }) {

    //translation
    const { t } = useTranslation(translation, { keyPrefix: translation });

    //states
    const [editable, setEditable] = useState(false);

    const updateWorkPhase = (recipeID, newWorkPhase) => {
        const updates = {};
        updates[`${dbUrl}/${recipeID}/${workPhase.id}`] = newWorkPhase;
        update(ref(db), updates);
        setEditable(false);
    }

    return (
        <div className={translation}>
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
                                onClick={() => onDelete(recipeID, workPhase.id)} />
                        </span>
                    }
                </Col>
            </Row>
            <Row>
                <Col>{workPhase.estimatedLength ? workPhase.estimatedLength : 0} {t('in_minutes')}</Col>
            </Row>
            {editable &&
                <AddWorkPhase
                    dbUrl={dbUrl}
                    translation={translation}
                    workPhaseID={workPhase.id}
                    recipeID={recipeID}
                    onSave={updateWorkPhase}
                    onClose={() => setEditable(false)} />
            }
        </div>
    )
}

WorkPhase.defaultProps = {
    dbUrl: '/none',
    translation: '',
}

WorkPhase.propTypes = {
    dbUrl: PropTypes.string,
    translation: PropTypes.string,
    recipeID: PropTypes.string,
    onDelete: PropTypes.func
}