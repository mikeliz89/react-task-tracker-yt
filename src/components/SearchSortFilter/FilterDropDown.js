import PropTypes from 'prop-types';
import { Col, Row, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { TRANSLATION } from '../../utils/Constants';

export default function FilterDropDown({ id, labelText, value, onSet, options }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.SEARCHSORTFILTER });

    return (
        <Form.Group as={Row} className="mb-2">
            <Form.Label column xs={3} sm={2}>{t(labelText)}</Form.Label>
            <Col xs={9} sm={10}>
                <Form.Select
                    value={value}
                    onChange={(event) => onSet(event.target.value)}
                    id={id}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>{t(option.labelText)}</option>
                    ))}
                </Form.Select>
            </Col>
        </Form.Group>
    )
}

FilterDropDown.defaultProps = {
    options: []
}

FilterDropDown.propTypes = {
    id: PropTypes.string,
    labelText: PropTypes.string,
    value: PropTypes.string,
    onSet: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        labelText: PropTypes.string
    }))
}



