import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import AddGarnish from './AddGarnish';
import Icon from '../Icon';
import * as Constants from '../../utils/Constants';
import { updateToFirebaseByIdAndSubId } from '../../datatier/datatier';
import RightWrapper from '../Site/RightWrapper';

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
                            <Icon name={Constants.ICON_EDIT} className={Constants.CLASSNAME_EDITBTN}
                                style={{ color: Constants.COLOR_LIGHT_GRAY, cursor: 'pointer', fontSize: '1.2em' }}
                                onClick={() => editable ? setEditable(false) : setEditable(true)} />
                            <Icon name={Constants.ICON_DELETE} className={Constants.CLASSNAME_DELETEBTN}
                                style={{ color: Constants.COLOR_DELETEBUTTON, cursor: 'pointer', fontSize: '1.2em' }}
                                onClick={() => onDelete(drinkID, garnish.id)} />
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
