import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { removeFromFirebaseByIdAndSubId, subscribeToFirebaseByIdAsArray, updateToFirebaseByIdAndSubId } from '../../datatier/datatier';
import { TRANSLATION, ICONS } from '../../utils/Constants';
import Icon from '../Icon';

import AddComment from './AddComment';
import CommentsInner from './CommentsInner';

export default function Comments({ url, objID, onCounterChange, onSave, onEdit }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.COMMENTS });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //states
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);

    //load data
    useEffect(() => {
        const hasValidUrl = typeof url === 'string' && url.trim() !== '';
        const hasValidObjID = typeof objID === 'string' && objID.trim() !== '';

        if (!hasValidUrl || !hasValidObjID) {
            setComments([]);
            if (typeof onCounterChange === 'function') {
                onCounterChange(0);
            }
            setLoading(false);
            return;
        }

        const unsubscribe = subscribeToFirebaseByIdAsArray(url, objID, (fromDB) => {
            setComments(fromDB);
            if (typeof onCounterChange === 'function') {
                onCounterChange(fromDB.length);
            }
            setLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, [url, objID, onCounterChange]);

    const deleteComment = (commentID) => {
        removeFromFirebaseByIdAndSubId(url, objID, commentID);
    }

    const editComment = (comment) => {
        updateToFirebaseByIdAndSubId(url, objID, comment.id, comment);
        if (typeof onEdit === 'function') {
            onEdit(comment);
        }
    }

    return loading ? (
        <h3>{tCommon("loading")}</h3>
    ) : (
        <div className="inner-content">
            <AddComment onSave={onSave} />
            {/* <pre>{JSON.stringify(comments)}</pre> */}

            {
                comments != null && comments.length > 0 ? (
                    <CommentsInner onDelete={deleteComment} onEdit={editComment} comments={comments} />
                ) : (
                    <div className="comments-empty-state">
                        <Icon name={ICONS.COMMENTS} color="rgba(255,255,255,0.55)" fontSize="2.25rem" className="comments-empty-icon" />
                        <p>{t('no_comments')}</p>
                    </div>
                )
            }
        </div>
    )
}


