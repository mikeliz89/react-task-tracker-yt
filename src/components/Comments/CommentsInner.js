import { getJsonAsDateTimeString } from "../../utils/DateTimeUtils";
import i18n from "i18next";
import DeleteButton from '../Buttons/DeleteButton';
import Icon from '../Icon';
import { ICONS } from '../../utils/Constants';

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
                            <div className="comment-item-actions">
                                <button type="button" className="comment-action-button">Vastaa</button>
                                <span className="comment-action-divider">|</span>
                                <button type="button" className="comment-action-icon-button" title="Kommentti">
                                    <Icon name={ICONS.COMMENTS} color="currentColor" />
                                </button>
                                <button type="button" className="comment-action-icon-button" title="Poista kommentti" onClick={() => onDelete(comment.id)}>
                                    <Icon name={ICONS.DELETE} color="currentColor" />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : '-'
            }
        </div>
    )
}
