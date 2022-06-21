//react
import { Row, Col, Form } from 'react-bootstrap';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
//buttons
import Button from '../Button';
import StarRating from './StarRating';
//props
import PropTypes from 'prop-types'

const SetStarRating = ({ starCount, onSaveStars }) => {

    //states
    const [showStarRating, setShowStarRating] = useState(false);
    const [stars, setStars] = useState(starCount);
    const [loading, setLoading] = useState(false);

    //translation
    const { t } = useTranslation('starrating', { keyPrefix: 'starrating' });

    async function onSubmit(e) {
        e.preventDefault();

        setLoading(true);

        //tallenna
        onSaveStars(stars);

        setLoading(false);
    }

    return (
        <>
            <Button
                color={showStarRating ? 'red' : '#0d6efd'}
                text={showStarRating ? t('button_close') : t('rate')}
                onClick={() => setShowStarRating(!showStarRating)} />
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
                                    <Button
                                        disabled={loading} type='submit'
                                        text={t('save_rating')} className='btn btn-block' />
                                </Form>
                            </Col>
                        </Row>
                    </>) : ''
            }
        </>
    )
}

export default SetStarRating

SetStarRating.defaultProps = {
    starCount: 0
}

SetStarRating.propTypes = {
    starCount: PropTypes.number
}
