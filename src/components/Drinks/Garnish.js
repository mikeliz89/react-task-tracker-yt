import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { db } from '../../firebase-config';
import { update, ref } from "firebase/database";
import AddGarnish from './AddGarnish';
import Icon from '../Icon';
import * as Constants from '../../utils/Constants';

export const Garnish = ({ garnish, drinkID, onDelete }) => {

    //states
    const [editable, setEditable] = useState(false);

    const updateGarnish = (drinkID, newGarnish) => {
        const updates = {};
        updates[`${Constants.DB_DRINK_GARNISHES}/${drinkID}/${garnish.id}`] = newGarnish;
        update(ref(db), updates);
        setEditable(false);
    }

    return (
        <div className='drinks'>
            <Row>
                <Col xs={9}>
                    <span style={{ fontWeight: 'bold' }}>{garnish.name}</span>
                </Col>
                <Col xs={3}>
                    {
                        <span style={{ float: 'right' }}>
                            <Icon name='edit' className="editBtn" style={{ color: 'light-gray', cursor: 'pointer', fontSize: '1.2em' }}
                                onClick={() => editable ? setEditable(false) : setEditable(true)} />
                            <Icon name='times' className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                                onClick={() => onDelete(drinkID, garnish.id)} />
                        </span>
                    }
                </Col>
            </Row>
            {editable &&
                <AddGarnish
                    garnishID={garnish.id}
                    drinkID={drinkID}
                    onSave={updateGarnish}
                    onDelete={onDelete}
                    onClose={() => setEditable(false)} />
            }
        </div>
    )
}
