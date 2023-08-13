import { useTranslation } from 'react-i18next';
import { Col, Row, Form } from 'react-bootstrap';
import * as Constants from '../../utils/Constants';

export default function FilterCheckBox({ onSet, labelText, id }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_SEARCHSORTFILTER, { keyPrefix: Constants.TRANSLATION_SEARCHSORTFILTER });

    return (
        <Form.Group as={Row} controlId={'searchSortFilter-CheckBox' + id}>
            <Form.Label column xs={3} sm={2}>{t('show')}</Form.Label>
            <Col xs={9} sm={10}>
                <Form.Check label={t(labelText)}
                    onChange={(e) => {
                        onSet(e.currentTarget.checked);
                    }} />
            </Col>
        </Form.Group>
    )
}