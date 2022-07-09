//links
import LinkInner from "./LinkInner";

const LinksInner = ({ links, objID, linkUrl, onDelete, onEdit }) => {

    return (
        <div>
            {links
                ? links.map((link) =>
                    <div key={link.id} style={{ padding: '5px', border: '1px solid black' }}>
                        <LinkInner link={link} objID={objID} linkUrl={linkUrl} onDelete={onDelete} onEdit={onEdit} />
                    </div>
                ) : '-'
            }
        </div>
    )
}

export default LinksInner
