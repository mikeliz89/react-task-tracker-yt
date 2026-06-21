import { useState } from 'react';
import i18n from "i18next";

import AddComment from './AddComment';
import { getJsonAsDateTimeString } from "../../utils/DateTimeUtils";
import DeleteButton from '../Buttons/DeleteButton';
import EditButton from '../Buttons/EditButton';

export default function CommentsInner({ comments, onDelete, onEdit }) {

    const [editableCommentId, setEditableCommentId] = useState('');

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

    return (
        <div className="comments-list">
            {comments
                ? comments.map((comment) => {
                    const editable = editableCommentId === comment.id;
                    return (
                        <div key={comment.id} className="comment-item">
                            <div className="comment-avatar" aria-hidden="true"></div>
                            <div className="comment-item-body">
                                <div className="comment-item-meta">
                                    <div className="comment-item-author-row">
                                        <span className="comment-item-author">{getCommentAuthorLabel(comment.createdBy)}</span>
                                        <span className="comment-item-date">{getJsonAsDateTimeString(comment.created, i18n.language)}</span>
                                    </div>
                                    <div className="comment-item-actions">
                                        <EditButton
                                            editable={editable}
                                            setEditable={(nextEditable) => setEditableCommentId(nextEditable ? comment.id : '')}
                                            className="comment-edit-button"
                                            color="rgba(226, 232, 255, 0.58)"
                                            fontSize="1rem"
                                        />
                                        <DeleteButton
                                            onDelete={onDelete}
                                            id={comment.id}
                                            color="rgba(226, 232, 255, 0.58)"
                                            className="comment-delete-button"
                                            fontSize="1rem"
                                        />
                                    </div>
                                </div>
                                <div className="comment-item-text">
                                    {comment.text}
                                </div>
                                {editable && (
                                    <div className="comment-item-edit-row">
                                        <AddComment
                                            onSave={(updatedComment) => {
                                                if (typeof onEdit === 'function') {
                                                    onEdit({ ...comment, ...updatedComment });
                                                }
                                            }}
                                            commentID={comment.id}
                                            initialText={comment.text}
                                            onClose={() => setEditableCommentId('')}
                                            showToggleButton={false}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                }) : '-'
            }
        </div>
    )
}



