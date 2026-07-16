import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import SetStarRating from './SetStarRating';
import StarRating from './StarRating';

export default function StarRatingWrapper({ stars, onSaveStars, showSetStarRating, showStarRating }) {

    //rating
    const [showRating, setShowRating] = useState(showStarRating);

    useEffect(() => {
        setShowRating(showStarRating);
    }, [showStarRating]);

    return (
        <>
            {showSetStarRating ? (
                <SetStarRating
                    starCount={stars}
                    onSaveStars={onSaveStars}
                    onShow={() => { setShowRating(!showRating) }}
                />
            ) : null}
            {showRating ? <StarRating starCount={stars} /> : null}
        </>
    )
}

StarRatingWrapper.defaultProps = {
    stars: 0,
    showSetStarRating: true,
    showStarRating: true
}

StarRatingWrapper.propTypes = {
    stars: PropTypes.number,
    onSaveStars: PropTypes.func,
    showSetStarRating: PropTypes.bool,
    showStarRating: PropTypes.bool
}
