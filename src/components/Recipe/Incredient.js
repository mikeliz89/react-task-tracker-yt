import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import AddIncredient from './AddIncredient';
import PropTypes from 'prop-types';
import { updateToFirebaseByIdAndSubId } from '../../datatier/datatier';
import RightWrapper from '../Site/RightWrapper';
import DeleteButton from '../Buttons/DeleteButton';
import EditButton from '../Buttons/EditButton';

export default function Incredient({ dbUrl, translation, translationKeyPrefix, incredient, recipeID, onDelete }) {

    //states
    const [editable, setEditable] = useState(false);

    const updateIncredient = (recipeID, newIncredient) => {
        updateToFirebaseByIdAndSubId(dbUrl, recipeID, incredient.id, newIncredient);
        setEditable(false);
    }

    return (
        <div className='listContainer'>
            <Row>
                <Col xs={9}>
                    <span style={{ fontWeight: 'bold' }}>{incredient.name}</span>
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
                                id={recipeID}
                                subId={incredient.id}
                            />
                        </RightWrapper>
                    }
                </Col>
            </Row>
            <Row>
                <Col>{incredient.amount} {incredient.unit}</Col>
            </Row>
            {editable &&
                <AddIncredient
                    translation={translation}
                    translationKeyPrefix={translationKeyPrefix}
                    dbUrl={dbUrl}
                    incredientID={incredient.id}
                    recipeID={recipeID}
                    onSave={updateIncredient}
                    onClose={() => setEditable(false)} />
            }
        </div>
    )
}

Incredient.defaultProps = {
    dbUrl: '/none',
    translation: '',
}

Incredient.propTypes = {
    dbUrl: PropTypes.string,
    translation: PropTypes.string,
    recipeID: PropTypes.string,
    onDelete: PropTypes.func
}