import { ref, onValue, child } from 'firebase/database';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { removeFromFirebaseById, removeFromFirebaseByIdAndSubId, updateToFirebaseById, updateToFirebaseByIdAndSubId } from '../../datatier/datatier';
import { db } from '../../firebase-config';
import { TRANSLATION } from '../../utils/Constants';

import AddLink from './AddLink';
import LinksInner from './LinksInner';

export default function Links({ url, objID, onCounterChange, onSaveLink }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.LINKS });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, {keyPrefix: TRANSLATION.COMMON});

    //states
    const [loading, setLoading] = useState(true);
    const [links, setLinks] = useState({});

    //load data
    useEffect(() => {
        if (url === "") {
            setLoading(false);
            return;
        }

        const dbref = objID ? child(ref(db, url), objID) : ref(db, url);
        const unsubscribe = onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            let counterTemp = 0;
            for (let id in snap) {
                counterTemp++;
                fromDB.push({ id, ...snap[id] });
            }
            setLinks(fromDB);
            onCounterChange(counterTemp);
            setLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, [url, objID, onCounterChange]);

    const deleteLink = (linkID) => {
        if (objID != null) {
            removeFromFirebaseByIdAndSubId(url, objID, linkID);
        } else {
            removeFromFirebaseById(url, linkID);
        }
    }

    const editLink = (link) => {
        if (objID != null) {
            updateToFirebaseByIdAndSubId(url, objID, link.id, link);
        } else {
            updateToFirebaseById(url, link.id, link);
        }
    }

    return loading ? (
        <h3>{tCommon("loading")}</h3>
    ) : (
        <div className="inner-content">
            <AddLink onSaveLink={onSaveLink} />
            {/* <pre>{JSON.stringify(links)}</pre> */}
            {
                links != null && links.length > 0 ? (
                    <LinksInner objID={objID} linkUrl={url} links={links} onDelete={deleteLink} onEdit={editLink} />
                ) : <div className="links-empty-state">{t('no_links')}</div>
            }
        </div>
    )
}


