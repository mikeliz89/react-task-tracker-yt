import PropTypes from 'prop-types';
import { FaStarHalfAlt, FaStar, FaRegStar } from 'react-icons/fa';

export default function StarRating({ starCount }) {
    const maxNumber = 5;
    return (
        <div>
            {starCount === 0 &&
                <>
                    <FaRegStar />
                    <FaRegStar />
                    <FaRegStar />
                    <FaRegStar />
                    <FaRegStar />
                </>
            }
            {starCount > 0 && starCount < 1 &&
                <>
                    <FaStarHalfAlt />
                    <FaRegStar />
                    <FaRegStar />
                    <FaRegStar />
                    <FaRegStar />
                </>
            }
            {starCount === 1 &&
                <>
                    <FaStar />
                    <FaRegStar />
                    <FaRegStar />
                    <FaRegStar />
                    <FaRegStar />
                </>
            }
            {starCount > 1 && starCount < 2 &&
                <>
                    <FaStar />
                    <FaStarHalfAlt />
                    <FaRegStar />
                    <FaRegStar />
                    <FaRegStar />
                </>
            }
            {starCount === 2 &&
                <>
                    <FaStar />
                    <FaStar />
                    <FaRegStar />
                    <FaRegStar />
                    <FaRegStar />
                </>
            }
            {starCount > 2 && starCount < 3 &&
                <>
                    <FaStar />
                    <FaStar />
                    <FaStarHalfAlt />
                    <FaRegStar />
                    <FaRegStar />
                </>
            }
            {starCount === 3 &&
                <>
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaRegStar />
                    <FaRegStar />
                </>
            }
            {starCount > 3 && starCount < 4 &&
                <>
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStarHalfAlt />
                    <FaRegStar />
                </>
            }
            {starCount === 4 &&
                <>
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaRegStar />
                </>
            }
            {starCount > 4 && starCount < 5 &&
                <>
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStarHalfAlt />
                </>
            }
            {starCount === 5 &&
                <>
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                </>
            }
            &nbsp;&nbsp;
            {starCount.toFixed(1) + ' / ' + maxNumber.toFixed(1)}
        </div>
    )
}

StarRating.defaultProps = {
    starCount: 0
}

StarRating.propTypes = {
    starCount: PropTypes.number
}
