import { Col, Row } from "react-bootstrap";
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
            <Row>
                <Col xs={9}>
                    <a href={link.url} target="_blank" rel="noreferrer">{link.urlText}</a>
                </Col>
                <Col xs={3}>
                    {
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