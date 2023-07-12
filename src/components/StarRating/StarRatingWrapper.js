import PropTypes from 'prop-types';
import { useState } from 'react';
import SetStarRating from './SetStarRating';
import StarRating from './StarRating';

export default function StarRatingWrapper({ stars, onSaveStars }) {

    //rating
    const [showRating, setShowRating] = useState(true);

    return (
        <>
            <SetStarRating
                starCount={stars}
                onSaveStars={onSaveStars}
                onShow={() => { setShowRating(!showRating) }}
            />
            {showRating && <StarRating starCount={stars} />}
        </>
    )
}

StarRating.defaultProps = {
    starCount: 0
}

StarRating.propTypes = {
    starCount: PropTypes.number,
    onSaveStars: PropTypes.func
}
