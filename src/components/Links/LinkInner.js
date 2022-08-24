//react
import { Col, Row } from "react-bootstrap";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
//links
import EditLink from "./EditLink";
//icon
import Icon from "../Icon";

const LinkInner = ({ link, objID, linkUrl, onEdit, onDelete }) => {

    //translation
    const { t } = useTranslation('links', { keyPrefix: 'links' });

    //states
    const [editable, setEditable] = useState(false);

    const editLink = (link) => {
        onEdit(link);
        setEditable(false);
    }

    return (
        <>
            <Row>
                <Col xs={9}>
                    <a href={link.url} target="_blank" rel="noreferrer">{link.urlText}</a>
                </Col>
                <Col xs={3}>
                    {
                        <span style={{ float: 'right' }}>
                            <Icon name='edit' className="editBtn" style={{ color: 'light-gray', cursor: 'pointer', fontSize: '1.2em' }}
                                onClick={() => editable ? setEditable(false) : setEditable(true)} />
                            <Icon name='times' className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                                onClick={() => { if (window.confirm(t('delete_link_confirm'))) { onDelete(link.id); } }} />
                        </span>
                    }
                </Col>
            </Row>
            {editable &&
                <Row>
                    <Col>
                        <EditLink
                            objID={objID}
                            linkUrl={linkUrl}
                            linkID={link.id}
                            onEditLink={editLink}
                            onCloseEditLink={() => setEditable(false)} />
                    </Col>
                </Row>
            }
        </>
    )
}

export default LinkInner