//react
import { FaTimes } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

const LinksInner = ({ links, onDelete }) => {

    //translation
    const { t } = useTranslation('links', { keyPrefix: 'links' });

    return (
        <div>
            {links
                ? links.map((link) =>
                    <div key={link.id}>
                        <a href={link.url} target="_blank" rel="noreferrer">{link.urlText}</a>
                        <FaTimes className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                            onClick={() => { if (window.confirm(t('delete_link_confirm'))) { onDelete(link.id); } }} />
                    </div>
                ) : '-'
            }
        </div>
    )
}

export default LinksInner
