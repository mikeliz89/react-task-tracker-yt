//utils
import { getJsonAsDateTimeString } from "../../utils/DateTimeUtils";
//i18n
import i18n from "i18next";
//react
import { useTranslation } from 'react-i18next';
import { FaTimes } from "react-icons/fa";

const CommentsInner = ({ comments, onDelete }) => {

    //translation
    const { t } = useTranslation('comments', { keyPrefix: 'comments' });

    return (
        <div>
            {comments
                ? comments.map((comment) =>
                    <div key={comment.id}>
                        <p>
                            {getJsonAsDateTimeString(comment.created, i18n.language)} <br />
                            {comment.createdBy}: {comment.text}
                            <FaTimes className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                                onClick={() => { if (window.confirm(t('delete_comment_confirm'))) { onDelete(comment.id); } }} />
                        </p>
                    </div>
                ) : '-'
            }
        </div>
    )
}

export default CommentsInner
