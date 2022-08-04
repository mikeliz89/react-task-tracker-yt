//react
import { ButtonGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
//buttons
import GoBackButton from '../GoBackButton';

function ManageMovements() {

    //translation
    const { t } = useTranslation('exercises', { keyPrefix: 'exercises' });

    return (
        <Row>
            <ButtonGroup>
                <GoBackButton />
                <Link className="btn btn-primary" to={`/createmovement`}>{t('create_movement')}</Link>
            </ButtonGroup>
        </Row>
    )
}

export default ManageMovements