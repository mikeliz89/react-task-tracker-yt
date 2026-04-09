import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';

import { updateToFirebaseByIdAndSubId } from '../../datatier/datatier';
import { DB } from '../../utils/Constants';
import DeleteButton from '../Buttons/DeleteButton';
import EditButton from '../Buttons/EditButton';
import RightWrapper from '../Site/RightWrapper';

import AddPartsGymForm from './AddPartsGymForm';

export default function GymPart({ exerciseID, gymPart, onDelete }) {

    //states
    const [editable, setEditable] = useState(false);

    const updateGymPart = (exerciseID, newGymPart) => {
        updateToFirebaseByIdAndSubId(DB.EXERCISE_PARTS, exerciseID, gymPart.id, newGymPart);
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
                            <EditButton
                                editable={editable}
                                setEditable={setEditable}
                            />
                            <DeleteButton
                                onDelete={onDelete}
                                id={exerciseID}
                                subId={gymPart.id}
                            />
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


