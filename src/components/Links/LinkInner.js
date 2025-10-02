import { Col, Row } from "react-bootstrap";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import EditLink from "./EditLink";
import Icon from "../Icon";
import * as Constants from '../../utils/Constants';
import RightWrapper from "../Site/RightWrapper";

export default function LinkInner({ link, objID, linkUrl, onEdit, onDelete }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_LINKS });

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
                            <Icon name={Constants.ICON_EDIT} className={Constants.CLASSNAME_EDITBTN}
                                style={{ color: Constants.COLOR_LIGHT_GRAY, cursor: 'pointer', fontSize: '1.2em' }}
                                onClick={() => editable ? setEditable(false) : setEditable(true)} />
                            <Icon name={Constants.ICON_DELETE} className={Constants.CLASSNAME_DELETEBTN}
                                style={{ color: Constants.COLOR_DELETEBUTTON, cursor: 'pointer', fontSize: '1.2em' }}
                                onClick={() => { if (window.confirm(t('delete_link_confirm'))) { onDelete(link.id); } }} />
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