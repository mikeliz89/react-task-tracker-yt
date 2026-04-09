import { ref, onValue, child } from 'firebase/database';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { removeFromFirebaseByIdAndSubId } from '../../datatier/datatier';
import { db } from '../../firebase-config';
import { TRANSLATION, ICONS } from '../../utils/Constants';
import Icon from '../Icon';

import AddComment from './AddComment';
import CommentsInner from './CommentsInner';

export default function Comments({ url, objID, onCounterChange, onSave }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.COMMENTS });
const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //states
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState({});

    //load data
    useEffect(() => {
        if (url === "") {
            setLoading(false);
            return;
        }

        const dbref = child(ref(db, url), objID);
        const unsubscribe = onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            let commentCounterTemp = 0;
            if (snap) {
                for (let id in snap) {
                    commentCounterTemp++;
                    fromDB.push({ id, ...snap[id] });
                }
            }
            setComments(fromDB);
            onCounterChange(commentCounterTemp);
            setLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, [url, objID, onCounterChange]);

    const deleteComment = (commentID) => {
        removeFromFirebaseByIdAndSubId(url, objID, commentID);
    }

    return loading ? (
        <h3>{tCommon("loading")}</h3>
    ) : (
        <div className="inner-content">
            <AddComment onSave={onSave} />
            {/* <pre>{JSON.stringify(comments)}</pre> */}

            {
                comments != null && comments.length > 0 ? (
                    <CommentsInner onDelete={deleteComment} comments={comments} />
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


