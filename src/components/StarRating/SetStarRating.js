import { Row, Col, Form, ButtonGroup } from 'react-bootstrap';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../Buttons/Button';
import StarRating from './StarRating';
import PropTypes from 'prop-types';
import * as Constants from '../../utils/Constants';

export default function SetStarRating({ starCount, onSaveStars, onShow }) {

    //states
    const [showStarRating, setShowStarRating] = useState(false);
    const [stars, setStars] = useState(starCount);
    const [loading, setLoading] = useState(false);

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_STAR_RATING, { keyPrefix: Constants.TRANSLATION_STAR_RATING });

    async function onSubmit(e) {
        e.preventDefault();

        setLoading(true);

        onSaveStars(stars);

        setShowStarRating(false);
        onShow(true);

        setLoading(false);
    }

    const showRating = (show) => {
        setShowStarRating(show);
        onShow(show);
    }

    return (
        <>
            <Button
                iconName={Constants.ICON_STAR}
                disableStyle={true}
                className={showStarRating ? 'btn btn-danger' : 'btn btn-primary'}
                text={showStarRating ? t('button_close') : t('rate')}
                onClick={() => showRating(!showStarRating)} />
            {
                showStarRating ? (
                    <>
                        <Row>
                            <Col>
                                <StarRating starCount={Number(stars)} />
                                <Form onSubmit={onSubmit}>
                                    <Form.Group className="mb-3" controlId="setStarRatingForm-Rating">
                                        <Form.Range min="0" max="5" step="0.1" type='number'
                                            value={stars}
                                            onChange={(e) => setStars(e.target.value)} />
                                    </Form.Group>
                                    <Row>
                                        <ButtonGroup>
                                            <Button type='button' text={t('button_close')} className='btn btn-block'
                                                onClick={() => showRating(false)} />
                                            <Button
                                                disabled={loading} type='submit'
                                                text={t('save_rating')} className='btn btn-block saveBtn' />
                                        </ButtonGroup>
                                    </Row>
                                </Form>
                            </Col>
                        </Row>
                    </>) : ''
            }
        </>
    )
}

SetStarRating.defaultProps = {
    starCount: 0
}

SetStarRating.propTypes = {
    starCount: PropTypes.number
}
