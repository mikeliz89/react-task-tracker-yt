import { getJsonAsDateTimeString } from "../../utils/DateTimeUtils";
import * as Constants from '../../utils/Constants';
import i18n from "i18next";
import { useTranslation } from 'react-i18next';
import Icon from "../Icon";

export default function CommentsInner({ comments, onDelete }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_COMMENTS, { keyPrefix: Constants.TRANSLATION_COMMENTS });

    return (
        <div>
            {comments
                ? comments.map((comment) =>
                    <div key={comment.id}>
                        <p>
                            {getJsonAsDateTimeString(comment.created, i18n.language)} <br />
                            {comment.createdBy}: {comment.text}
                            &nbsp;
                            <Icon name={Constants.ICON_DELETE} className={Constants.CLASSNAME_DELETEBTN}
                                style={{ color: Constants.COLOR_DELETEBUTTON, cursor: 'pointer', fontSize: '1.2em' }}
                                onClick={() => { if (window.confirm(t('delete_comment_confirm'))) { onDelete(comment.id); } }} />
                        </p>
                    </div>
                ) : '-'
            }
        </div>
    )
}