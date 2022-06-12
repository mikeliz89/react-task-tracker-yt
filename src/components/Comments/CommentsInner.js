//utils
import { getJsonAsDateTimeString } from "../../utils/DateTimeUtils";
//i18n
import i18n from "i18next";

const CommentsInner = ({ comments }) => {
    return (
        <div>
            {
                comments.map((comment) => {
                    <p key={comment.id}>{comment.createdBy}{comment.text}</p>
                })
            }

            {comments
                ? comments.map((comment) =>
                    <div key={comment.id}>
                        <p>
                            {getJsonAsDateTimeString(comment.created, i18n.language)} <br />
                            {comment.createdBy}: {comment.text}
                        </p>
                    </div>
                ) : '-'
            }
        </div>
    )
}

export default CommentsInner
