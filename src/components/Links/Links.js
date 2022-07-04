
//react
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
//Firebase
import { db } from '../../firebase-config';
import { ref, onValue, child, remove } from "firebase/database";
//links
import LinksInner from './LinksInner';

const Links = ({ url, objID }) => {

    //translation
    const { t } = useTranslation('links', { keyPrefix: 'links' });

    //states
    const [links, setLinks] = useState({});
    const [linkCounter, setLinkCounter] = useState(0);

    //load data
    useEffect(() => {
        const getLinks = async () => {
            if (objID != null) {
                await fetchLinksFromFireBase(objID);
            } else {
                await fetchLinksFromFirebaseWithoutID();
            }
        }
        if (url !== "") {
            getLinks();
        }
    }, []);

    const fetchLinksFromFireBase = async (myObjID) => {
        const dbref = await child(ref(db, url), myObjID);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            let linkCounterTemp = 0;
            for (let id in snap) {
                linkCounterTemp++;
                fromDB.push({ id, ...snap[id] });
            }
            setLinks(fromDB);
            setLinkCounter(linkCounterTemp);
        })
    }

    const fetchLinksFromFirebaseWithoutID = async () => {

        const dbref = ref(db, url);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            let linkCounterTemp = 0;
            for (let id in snap) {
                linkCounterTemp++;
                fromDB.push({ id, ...snap[id] });
            }
            setLinks(fromDB);
            setLinkCounter(linkCounterTemp);
        })
    }

    const deleteLink = (linkID) => {
        if (objID != null) {
            const dbref = ref(db, `${url}/${objID}/${linkID}`);
            remove(dbref);
        } else {
            const dbref = ref(db, `${url}/${linkID}`);
            remove(dbref);
        }
    }

    return (
        <div>
            {/* <pre>{JSON.stringify(links)}</pre> */}
            <h4>{t('header')} {linkCounter > 0 ? '(' + linkCounter + ')' : ''}</h4>
            {
                links != null && links.length > 0 ? (
                    <LinksInner links={links} onDelete={deleteLink} />
                ) : t('no_links')
            }
        </div>
    )
}

export default Links
