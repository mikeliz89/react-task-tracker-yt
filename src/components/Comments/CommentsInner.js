import { getJsonAsDateTimeString } from "../../utils/DateTimeUtils";
import i18n from "i18next";
import DeleteButton from '../Buttons/DeleteButton';

export default function CommentsInner({ comments, onDelete }) {

    return (
        <div>
            {comments
                ? comments.map((comment) =>
                    <div key={comment.id}>
                        <p>
                            {getJsonAsDateTimeString(comment.created, i18n.language)} <br />
                            {comment.createdBy}: {comment.text}
                            <DeleteButton
                                onDelete={onDelete}
                                id={comment.id}
                            />
                        </p>
                    </div>
                ) : '-'
            }
        </div>
    )
}