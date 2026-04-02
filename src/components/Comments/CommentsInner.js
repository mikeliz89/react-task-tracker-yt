import { getJsonAsDateTimeString } from "../../utils/DateTimeUtils";
import i18n from "i18next";
import DeleteButton from '../Buttons/DeleteButton';

export default function CommentsInner({ comments, onDelete }) {

    return (
        <div className="comments-list">
            {comments
                ? comments.map((comment) =>
                    <div key={comment.id} className="comment-item">
                        <div className="comment-item-meta">
                            <span>{getJsonAsDateTimeString(comment.created, i18n.language)}</span>
                            <DeleteButton
                                onDelete={onDelete}
                                id={comment.id}
                            />
                        </div>
                        <div className="comment-item-text">
                            <strong>{comment.createdBy}</strong>: {comment.text}
                        </div>
                    </div>
                ) : '-'
            }
        </div>
    )
}