import StarRating from "../StarRating/StarRating";

function StarRatings() {
    return (
        <div>
            Star ratings:
            <StarRating starCount={0} />
            <StarRating starCount={0.1} />
            <StarRating starCount={0.5} />
            <StarRating starCount={1} />
            <StarRating starCount={1.5} />
            <StarRating starCount={2} />
            <StarRating starCount={2.5} />
            <StarRating starCount={3} />
            <StarRating starCount={3.5} />
            <StarRating starCount={4} />
            <StarRating starCount={4.5} />
            <StarRating starCount={5} />
        </div>
    )
}

export default StarRatings