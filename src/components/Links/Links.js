
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { db } from '../../firebase-config';
import { ref, onValue, child, update } from "firebase/database";
import LinksInner from './LinksInner';
import Icon from '../Icon';
import * as Constants from '../../utils/Constants';
import { removeFromFirebaseById, removeFromFirebaseByIdAndSubId } from '../../datatier/datatier';

const Links = ({ url, objID }) => {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_LINKS, { keyPrefix: Constants.TRANSLATION_LINKS });

    //states
    const [loading, setLoading] = useState(true);
    const [links, setLinks] = useState({});
    const [counter, setCounter] = useState(0);

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
            setCounter(counterTemp);
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
        const updates = {};
        if (objID != null) {
            updates[`${url}/${objID}/${link.id}`] = link;
        } else {
            updates[`${url}/${link.id}`] = link;
        }
        update(ref(db), updates);
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <div>
            {/* <pre>{JSON.stringify(links)}</pre> */}
            <h4>
                <Icon name='external-link-alt' color='gray' />
                {t('header')} {counter > 0 ? '(' + counter + ')' : ''}
            </h4>
            {
                links != null && links.length > 0 ? (
                    <LinksInner objID={objID} linkUrl={url} links={links} onDelete={deleteLink} onEdit={editLink} />
                ) : t('no_links')
            }
        </div>
    )
}

export default Links
