import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import AddIncredient from './AddIncredient';
import Icon from '../Icon';
import PropTypes from 'prop-types';
import { updateToFirebaseByIdAndSubId } from '../../datatier/datatier';
import RightWrapper from '../Site/RightWrapper';
import * as Constants from '../../utils/Constants';

export default function Incredient({ dbUrl, translation, incredient, recipeID, onDelete }) {

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
                            <Icon name={Constants.ICON_EDIT} className={Constants.CLASSNAME_EDITBTN}
                                style={{ color: 'light-gray', cursor: 'pointer', fontSize: '1.2em' }}
                                onClick={() => editable ? setEditable(false) : setEditable(true)} />
                            <Icon name={Constants.ICON_DELETE} className={Constants.CLASSNAME_DELETEBTN}
                                style={{ color: Constants.COLOR_DELETEBUTTON, cursor: 'pointer', fontSize: '1.2em' }}
                                onClick={() => onDelete(recipeID, incredient.id)} />
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