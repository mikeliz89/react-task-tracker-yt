
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { db } from '../../firebase-config';
import { ref, onValue, child } from 'firebase/database';
import CommentsInner from './CommentsInner';
import * as Constants from '../../utils/Constants';
import { removeFromFirebaseByIdAndSubId } from '../../datatier/datatier';
import PageTitle from '../PageTitle';

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
            <PageTitle title={t('header') + (commentCounter > 0 ? ' (' + commentCounter + ')' : '')}
                iconName='comments' iconColor='gray' isSubTitle={true} />
            {
                comments != null && comments.length > 0 ? (
                    <CommentsInner onDelete={deleteComment} comments={comments} />
                ) : t('no_comments')
            }
        </div>
    )
}

export default Comments
