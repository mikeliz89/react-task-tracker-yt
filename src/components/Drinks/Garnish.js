import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import AddGarnish from './AddGarnish';
import * as Constants from '../../utils/Constants';
import { updateToFirebaseByIdAndSubId } from '../../datatier/datatier';
import RightWrapper from '../Site/RightWrapper';
import DeleteButton from '../Buttons/DeleteButton';
import EditButton from '../Buttons/EditButton';

export default function Garnish({ garnish, drinkID, onDelete }) {

    //states
    const [editable, setEditable] = useState(false);

    const updateGarnish = (drinkID, newGarnish) => {
        updateToFirebaseByIdAndSubId(Constants.DB_DRINK_GARNISHES, drinkID, garnish.id, newGarnish);
        setEditable(false);
    }

    return (
        <div className='listContainer'>
            <Row>
                <Col xs={9}>
                    <span style={{ fontWeight: 'bold' }}>{garnish.name}</span>
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
                                id={drinkID}
                                subId={garnish.id}
                            />
                        </RightWrapper>
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
