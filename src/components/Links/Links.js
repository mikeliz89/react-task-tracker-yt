
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { db } from '../../firebase-config';
import { ref, onValue, child } from 'firebase/database';
import LinksInner from './LinksInner';
import * as Constants from '../../utils/Constants';
import { removeFromFirebaseById, removeFromFirebaseByIdAndSubId, updateToFirebaseById, updateToFirebaseByIdAndSubId } from '../../datatier/datatier';

const Links = ({ url, objID, onCounterChange }) => {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_LINKS, { keyPrefix: Constants.TRANSLATION_LINKS });

    //states
    const [loading, setLoading] = useState(true);
    const [links, setLinks] = useState({});

    //load data
    useEffect(() => {
        const getLinks = async () => {
            await fetchLink(objID);
        }
        if (url !== "") {
            getLinks();
        }
    }, []);

    const fetchLink = async (myObjID) => {
        let dbref;
        if (myObjID) {
            dbref = child(ref(db, url), myObjID);
        } else {
            dbref = ref(db, url);
        }
        fetchFromFirebase(dbref);
    }

    const fetchFromFirebase = (dbref) => {
        onValue(dbref, (snapshot) => {
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
        })
    }

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
        <h3>{t('loading')}</h3>
    ) : (
        <div>
            {/* <pre>{JSON.stringify(links)}</pre> */}
            {
                links != null && links.length > 0 ? (
                    <LinksInner objID={objID} linkUrl={url} links={links} onDelete={deleteLink} onEdit={editLink} />
                ) : t('no_links')
            }
        </div>
    )
}

export default Links
