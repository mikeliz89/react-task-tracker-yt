import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
    removeFromFirebaseById,
    removeFromFirebaseByIdAndSubId,
    subscribeToFirebaseAsArray,
    subscribeToFirebaseByIdAsArray,
    updateToFirebaseById,
    updateToFirebaseByIdAndSubId
} from '../../datatier/datatier';
import { TRANSLATION } from '../../utils/Constants';

import AddLink from './AddLink';
import LinksInner from './LinksInner';

export default function Links({ url, objID, onCounterChange, onSaveLink }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.LINKS });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //states
    const [loading, setLoading] = useState(true);
    const [links, setLinks] = useState({});

    //load data
    useEffect(() => {
        if (url === "") {
            setLoading(false);
            return;
        }

        const unsubscribe = objID
            ? subscribeToFirebaseByIdAsArray(url, objID, (fromDB) => {
                setLinks(fromDB);
                onCounterChange(fromDB.length);
                setLoading(false);
            })
            : subscribeToFirebaseAsArray(url, (fromDB) => {
                setLinks(fromDB);
                onCounterChange(fromDB.length);
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


