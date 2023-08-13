import { useTranslation } from 'react-i18next';
import { Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import Icon from '../Icon';
import AddPartsGymForm from './AddPartsGymForm';
import * as Constants from '../../utils/Constants';
import { updateToFirebaseByIdAndSubId } from '../../datatier/datatier';
import RightWrapper from '../Site/RightWrapper';

function GymPart({ exerciseID, gymPart, onDelete }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_EXERCISES, { keyPrefix: Constants.TRANSLATION_EXERCISES });

    //states
    const [editable, setEditable] = useState(false);

    const updateGymPart = (exerciseID, newGymPart) => {
        updateToFirebaseByIdAndSubId(Constants.DB_EXERCISE_PARTS, exerciseID, gymPart.id, newGymPart);
        setEditable(false);
    }

    return (
        <div className='listContainer'>

            <Row>
                <Col xs={9}>
                    <span style={{ fontWeight: 'bold' }}>{gymPart.name}</span>
                </Col>
                <Col xs={3}>
                    {
                        <RightWrapper>
                            <Icon name={Constants.ICON_EDIT} className="editBtn" style={{ color: 'light-gray', cursor: 'pointer', fontSize: '1.2em' }}
                                onClick={() => editable ? setEditable(false) : setEditable(true)} />
                            <Icon name={Constants.ICON_DELETE} className="deleteBtn"
                                style={{ color: Constants.COLOR_DELETEBUTTON, cursor: 'pointer', fontSize: '1.2em' }}
                                onClick={() => { if (window.confirm(t('delete_gympart_confirm_message'))) { onDelete(exerciseID, gymPart.id); } }} />
                        </RightWrapper>
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