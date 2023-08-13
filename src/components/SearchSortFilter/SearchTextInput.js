import { useTranslation } from 'react-i18next';
import { Col, Row, Form } from 'react-bootstrap';
import * as Constants from '../../utils/Constants';

export default function SearchTextInput({ setSearchString, placeholderText }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_SEARCHSORTFILTER, { keyPrefix: Constants.TRANSLATION_SEARCHSORTFILTER });

    return (
        <Form.Group as={Row}>
            <Form.Label column xs={3} sm={2}>{t('search')}</Form.Label>
            <Col xs={9} sm={10}>
                <Form.Control
                    autoComplete='off'
                    type="text"
                    id="inputSearchString"
                    aria-describedby="searchHelpBlock"
                    onChange={(e) => setSearchString(e.target.value)}
                    placeholder={t(placeholderText)}
                />
            </Col>
        </Form.Group>
    )
}