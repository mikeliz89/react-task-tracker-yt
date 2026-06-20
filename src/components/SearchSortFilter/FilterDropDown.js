import PropTypes from 'prop-types';
import { Col, Row, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { TRANSLATION } from '../../utils/Constants';

export default function FilterDropDown({ id, labelText, value, onSet, options, compact }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.SEARCHSORTFILTER });
    const label = t(labelText);
    const groupProps = compact ? {} : { as: Row };
    const select = (
        <Form.Select
            value={value}
            onChange={(event) => onSet(event.target.value)}
            id={id}
            aria-label={label}
            className={compact ? 'searchSortFilter-control' : undefined}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {compact ? `${label}: ${t(option.labelText)}` : t(option.labelText)}
                </option>
            ))}
        </Form.Select>
    );

    return (
        <Form.Group {...groupProps} className={compact ? 'mb-0 searchSortFilter-field' : 'mb-2'}>
            {
                compact
                    ? null
                    : <Form.Label column xs={3} sm={2}>{label}</Form.Label>
            }
            {
                compact
                    ? select
                    : <Col xs={9} sm={10}>{select}</Col>
            }
        </Form.Group>
    )
}

FilterDropDown.defaultProps = {
    options: [],
    compact: false
}

FilterDropDown.propTypes = {
    id: PropTypes.string,
    labelText: PropTypes.string,
    value: PropTypes.string,
    onSet: PropTypes.func,
    compact: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string,
        labelText: PropTypes.string
    }))
}



