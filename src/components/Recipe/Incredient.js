//react
import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
//firebase
import { db } from '../../firebase-config';
import { update, ref } from "firebase/database";
//recipe
import AddIncredient from './AddIncredient';
//icon
import Icon from '../Icon';
//proptypes
import PropTypes from 'prop-types';

export const Incredient = ({ dbUrl, translation, incredient, recipeID, onDelete }) => {

    //states
    const [editable, setEditable] = useState(false);

    const updateIncredient = (recipeID, newIncredient) => {
        const updates = {};
        updates[`${dbUrl}/${recipeID}/${incredient.id}`] = newIncredient;
        update(ref(db), updates);
        setEditable(false);
    }

    return (
        <div className={translation}>
            <Row>
                <Col xs={9}>
                    <span style={{ fontWeight: 'bold' }}>{incredient.name}</span>
                </Col>
                <Col xs={3}>
                    {
                        <span style={{ float: 'right' }}>
                            <Icon name='edit' className="editBtn" style={{ color: 'light-gray', cursor: 'pointer', fontSize: '1.2em' }}
                                onClick={() => editable ? setEditable(false) : setEditable(true)} />
                            <Icon name='times' className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                                onClick={() => onDelete(recipeID, incredient.id)} />
                        </span>
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