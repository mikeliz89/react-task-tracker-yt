//links
import LinkInner from "./LinkInner";

const LinksInner = ({ links, objID, linkUrl, onDelete, onEdit }) => {

    return (
        <div>
            {links
                ? links.map((link) =>
                    <div key={link.id} className='linkContainer'>
                        <LinkInner link={link} objID={objID} linkUrl={linkUrl} onDelete={onDelete} onEdit={onEdit} />
                    </div>
                ) : '-'
            }
        </div>
    )
}

export default LinksInner
