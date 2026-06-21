import { Col, Row, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { ICONS, TRANSLATION } from '../../utils/Constants';
import Icon from '../Icon';

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
        <div className='searchSortFilter-controlWrap'>
            <Icon name={ICONS.SEARCH} color="#8f9bb3" fontSize="1rem" className="searchSortFilter-searchIcon" />
            <Form.Control
                autoComplete='off'
                type="text"
                id={inputId}
                aria-describedby="searchHelpBlock"
                aria-label={compact ? text : undefined}
                onChange={(e) => setSearchString(e.target.value)}
                placeholder={text}
                className={compact ? 'searchSortFilter-control searchSortFilter-control-with-icon' : 'searchSortFilter-control-with-icon'}
            />
        </div>
    );

    return (
        <Form.Group {...groupProps} className={compact ? 'mb-0 searchSortFilter-field' : undefined}>
            {!compact && <Form.Label column xs={3} sm={2}>{text}</Form.Label>}
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


