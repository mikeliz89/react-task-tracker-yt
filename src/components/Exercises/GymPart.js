//react
import { useTranslation } from 'react-i18next';
import { Row, Col } from 'react-bootstrap';
//icon
import Icon from '../Icon';

function GymPart({ exerciseID, gymPart, onDelete }) {

    //translation
    const { t } = useTranslation('exercises', { keyPrefix: 'exercises' });

    return (
        <div className='exercise'>

            <Row>
                <Col xs={9}>
                    <span style={{ fontWeight: 'bold' }}>{gymPart.name}</span>
                </Col>
                <Col xs={3}>
                    {
                        <span style={{ float: 'right' }}>
                            <Icon name='times' className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                                onClick={() => { if (window.confirm(t('delete_gympart_confirm_message'))) { onDelete(exerciseID, gymPart.id); } }} />
                        </span>
                    }
                </Col>
            </Row>

            {gymPart.series} x {gymPart.weight > 0 ? gymPart.weight + ' (kg) x' : ''}   {gymPart.repeat}

        </div>
    )
}

export default GymPart