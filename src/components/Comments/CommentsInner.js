import { getJsonAsDateTimeString } from "../../utils/DateTimeUtils";
import * as Constants from '../../utils/Constants';
import i18n from "i18next";
import { useTranslation } from 'react-i18next';
import DeleteButton from '../Buttons/DeleteButton';

export default function CommentsInner({ comments, onDelete }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_COMMENTS });
    const { t: tCommon } = useTranslation(Constants.TRANSLATION_COMMON, { keyPrefix: Constants.TRANSLATION_COMMON_CONFIRM });

    return (
        <div>
            {comments
                ? comments.map((comment) =>
                    <div key={comment.id}>
                        <p>
                            {getJsonAsDateTimeString(comment.created, i18n.language)} <br />
                            {comment.createdBy}: {comment.text}
                            <DeleteButton
                                confirmMessage={tCommon('areyousure')}
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