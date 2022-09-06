//react
import { useTranslation } from 'react-i18next';
import { Row, Col } from 'react-bootstrap';
import { useState } from 'react';
//icon
import Icon from '../Icon';
//exercises
import AddPartsGymForm from './AddPartsGymForm';
//firebase
import { ref, update } from 'firebase/database';
import { db } from '../../firebase-config';
//utils
import * as Constants from '../../utils/Constants';

function GymPart({ exerciseID, gymPart, onDelete }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_EXERCISES, { keyPrefix: Constants.TRANSLATION_EXERCISES });

    //states
    const [editable, setEditable] = useState(false);

    const updateGymPart = (exerciseID, newGymPart) => {
        const updates = {};
        updates[`${Constants.DB_EXERCISE_PARTS}/${exerciseID}/${gymPart.id}`] = newGymPart;
        update(ref(db), updates);
        setEditable(false);
    }

    return (
        <div className='exercise'>

            <Row>
                <Col xs={9}>
                    <span style={{ fontWeight: 'bold' }}>{gymPart.name}</span>
                </Col>
                <Col xs={3}>
                    {
                        <span style={{ float: 'right' }}>
                            <Icon name='edit' className="editBtn" style={{ color: 'light-gray', cursor: 'pointer', fontSize: '1.2em' }}
                                onClick={() => editable ? setEditable(false) : setEditable(true)} />
                            <Icon name='times' className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                                onClick={() => { if (window.confirm(t('delete_gympart_confirm_message'))) { onDelete(exerciseID, gymPart.id); } }} />
                        </span>
                    }
                </Col>
            </Row>

            {gymPart.series} x {gymPart.weight > 0 ? gymPart.weight + ' (kg) x' : ''}   {gymPart.repeat}

            {editable &&
                <AddPartsGymForm
                    gymPartID={gymPart.id}
                    exerciseID={exerciseID}
                    onSave={updateGymPart}
                    onDelete={onDelete}
                    onClose={() => setEditable(false)} />
            }

        </div>
    )
}

export default GymPart