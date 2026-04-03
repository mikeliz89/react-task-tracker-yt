import { useState } from "react";
import EditLink from "./EditLink";
import RightWrapper from "../Site/RightWrapper";
import DeleteButton from '../Buttons/DeleteButton';
import EditButton from '../Buttons/EditButton';

export default function LinkInner({ link, objID, linkUrl, onEdit, onDelete }) {

    //states
    const [editable, setEditable] = useState(false);

    const editLink = (link) => {
        onEdit(link);
        setEditable(false);
    }

    return (
        <>
            <div className="link-item-row">
                <div className="link-item-main">
                    <a className="link-item-title" href={link.url} target="_blank" rel="noreferrer">
                        {link.urlText}
                    </a>
                    <div className="link-item-url">{link.url}</div>
                </div>
                <div className="link-item-actions">
                    <RightWrapper>
                        <EditButton
                            editable={editable}
                            setEditable={setEditable}
                        />
                        <DeleteButton
                            onDelete={onDelete}
                            id={link.id}
                        />
                    </RightWrapper>
                </div>
            </div>
            {editable &&
                <div className="link-item-edit-row">
                        <EditLink
                            objID={objID}
                            linkUrl={linkUrl}
                            linkID={link.id}
                            onEditLink={editLink}
                            onCloseEditLink={() => setEditable(false)} />
                </div>
            }
        </>
    )
}