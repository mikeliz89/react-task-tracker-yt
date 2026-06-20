import { Col, Row, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { TRANSLATION } from '../../utils/Constants';

export default function SearchTextInput({
    setSearchString,
    placeholderText,
    inputId,
    compact
}) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.SEARCHSORTFILTER });
    const text = t(placeholderText);
    const groupProps = compact ? {} : { as: Row };
    const control = (
        <Form.Control
            autoComplete='off'
            type="text"
            id={inputId}
            aria-describedby="searchHelpBlock"
            onChange={(e) => setSearchString(e.target.value)}
            placeholder={text}
            className={compact ? 'searchSortFilter-control' : undefined}
        />
    );

    return (
        <Form.Group {...groupProps} className={compact ? 'mb-0 searchSortFilter-field' : undefined}>
            {
                compact
                    ? <Form.Label htmlFor={inputId} className='searchSortFilter-label'>{text}</Form.Label>
                    : <Form.Label column xs={3} sm={2}>{text}</Form.Label>
            }
            {
                compact
                    ? control
                    : <Col xs={9} sm={10}>{control}</Col>
            }
        </Form.Group>
    )
}

SearchTextInput.defaultProps = {
    inputId: 'inputSearchString',
    compact: false
}


