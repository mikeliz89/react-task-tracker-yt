
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { db } from '../../firebase-config';
import { ref, onValue, child } from 'firebase/database';
import CommentsInner from './CommentsInner';
import Icon from '../Icon';
import * as Constants from '../../utils/Constants';
import { removeFromFirebaseByIdAndSubId } from '../../datatier/datatier';

const Comments = ({ url, objID }) => {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_COMMENTS, { keyPrefix: Constants.TRANSLATION_COMMENTS });

    //states
    const [comments, setComments] = useState({});
    const [commentCounter, setCommentCounter] = useState(0);

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
            setCommentCounter(commentCounterTemp);
        })
    }

    const deleteComment = (commentID) => {
        removeFromFirebaseByIdAndSubId(url, objID, commentID);
    }

    return (
        <div>
            {/* <pre>{JSON.stringify(comments)}</pre> */}
            <h4>
                <Icon name='comments' color='gray' />
                {t('header')} {commentCounter > 0 ? '(' + commentCounter + ')' : ''}
            </h4>
            {
                comments != null && comments.length > 0 ? (
                    <CommentsInner onDelete={deleteComment} comments={comments} />
                ) : t('no_comments')
            }
        </div>
    )
}

export default Comments
