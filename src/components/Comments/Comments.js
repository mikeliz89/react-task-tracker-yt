
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { db } from '../../firebase-config';
import { ref, onValue, child } from 'firebase/database';
import AddComment from './AddComment';
import CommentsInner from './CommentsInner';
import Icon from '../Icon';
import { TRANSLATION, ICONS } from '../../utils/Constants';
import { removeFromFirebaseByIdAndSubId } from '../../datatier/datatier';

export default function Comments({ url, objID, onCounterChange, onSave }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.COMMENTS });

    //states
    const [comments, setComments] = useState({});

    //load data
    useEffect(() => {
        const getComments = async () => {
            await fetchCommentsFromFireBase();
        }
        if (url !== "") {
            getComments();
        }
    }, []);

    const fetchCommentsFromFireBase = async () => {
        const dbref = await child(ref(db, url), objID);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            let commentCounterTemp = 0;
            for (let id in snap) {
                commentCounterTemp++;
                fromDB.push({ id, ...snap[id] });
            }
            setComments(fromDB);
            onCounterChange(commentCounterTemp);
        })
    }

    const deleteComment = (commentID) => {
        removeFromFirebaseByIdAndSubId(url, objID, commentID);
    }

    return (
        <div className="comments-content">
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