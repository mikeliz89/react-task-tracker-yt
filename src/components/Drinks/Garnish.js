//react
import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
//firebase
import { db } from '../../firebase-config';
import { update, ref } from "firebase/database";
//drinks
import AddGarnish from './AddGarnish';
//icon
import Icon from '../Icon';

export const Garnish = ({ garnish, drinkID, onDelete }) => {

    //constants
    const DB_DRINK_GARNISHES = '/drink-garnishes';

    //states
    const [editable, setEditable] = useState(false);

    const updateGarnish = (drinkID, newGarnish) => {
        const updates = {};
        updates[`${DB_DRINK_GARNISHES}/${drinkID}/${garnish.id}`] = newGarnish;
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
                    onCloseEditGarnish={() => setEditable(false)} />
            }
        </div>
    )
}
