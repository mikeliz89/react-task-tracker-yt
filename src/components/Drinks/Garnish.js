//react
import { FaTimes, FaEdit } from 'react-icons/fa';
import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
//firebase
import { db } from '../../firebase-config';
import { update, ref } from "firebase/database";
//drinks
import EditGarnish from './EditGarnish';

export const Garnish = ({ garnish, drinkID, onDelete }) => {

    const DB_DRINK_GARNISHES = '/drink-garnishes';

    //states
    const [editable, setEditable] = useState(false);

    const editGarnish = (garnish) => {
        //save
        const updates = {};
        updates[`${DB_DRINK_GARNISHES}/${drinkID}/${garnish.id}`] = garnish;
        update(ref(db), updates);
        setEditable(false);
    }

    return (
        <div key={garnish.id} className='drink'>
            <Row>
                <Col xs={9}>
                    <span style={{ fontWeight: 'bold' }}>{garnish.name}</span>
                </Col>
                <Col xs={3}>
                    {
                        <span style={{ float: 'right' }}>
                            <FaEdit className="editBtn" style={{ color: 'light-gray', cursor: 'pointer', fontSize: '1.2em' }}
                                onClick={() => editable ? setEditable(false) : setEditable(true)} />
                            <FaTimes className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                                onClick={() => onDelete(drinkID, garnish.id)} />
                        </span>
                    }
                </Col>
            </Row>
            {editable &&
                <EditGarnish
                    garnishID={garnish.id}
                    drinkID={drinkID}
                    onEditGarnish={editGarnish}
                    onDelete={onDelete}
                    onCloseEditGarnish={() => setEditable(false)} />
            }
        </div>
    )
}
