import i18n from "i18next";

import { getJsonAsDateTimeString } from "../../utils/DateTimeUtils";
import DeleteButton from '../Buttons/DeleteButton';

const getCommentAuthorLabel = (author) => {
    if (!author) {
        return 'Unknown';
    }

    const emailName = author.includes('@') ? author.split('@')[0] : author;

    return emailName
        .split(/[._-]/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

export default function CommentsInner({ comments, onDelete }) {

    return (
        <div className="comments-list">
            {comments
                ? comments.map((comment) =>
                    <div key={comment.id} className="comment-item">
                        <div className="comment-avatar" aria-hidden="true"></div>
                        <div className="comment-item-body">
                            <div className="comment-item-meta">
                                <div className="comment-item-author-row">
                                    <span className="comment-item-author">{getCommentAuthorLabel(comment.createdBy)}</span>
                                    <span className="comment-item-date">{getJsonAsDateTimeString(comment.created, i18n.language)}</span>
                                </div>
                                <DeleteButton
                                    onDelete={onDelete}
                                    id={comment.id}
                                    color="rgba(226, 232, 255, 0.58)"
                                    className="comment-delete-button"
                                    fontSize="1rem"
                                />
                            </div>
                            <div className="comment-item-text">
                                {comment.text}
                            </div>
                        </div>
                    </div>
                ) : '-'
            }
        </div>
    )
}



