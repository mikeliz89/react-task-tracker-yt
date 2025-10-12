import { Row, Col } from "react-bootstrap";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { getJsonAsDateTimeString, getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import * as Constants from '../../utils/Constants';
import Icon from "../Icon";
import DeleteButton from '../Buttons/DeleteButton';
import AddMaintenance from "./AddMaintenance";
import { updateToFirebaseById } from "../../datatier/datatier";
import RightWrapper from "../Site/RightWrapper";

export default function CarMaintenance({ carMaintenance, onDelete }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_CAR });

    //states
    const [editable, setEditable] = useState(false);

    const updateMaintenance = (maintenance) => {
        maintenance["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(Constants.DB_CAR_MAINTENANCE, carMaintenance.id, maintenance);
        setEditable(false);
    }

    return (
        <>
            <Row style={{ marginBottom: '5px', borderTop: '1px solid black' }}>
                <Col>
                    <b>{getJsonAsDateTimeString(carMaintenance.created, i18n.language)}</b>&nbsp;
                    {carMaintenance.createdBy}
                    <br />
                    {t('maintenance_name')}: {carMaintenance.name} <br />
                    {t('maintenance_description')}: {carMaintenance.description} <br />
                    {t('maintenance_price')}: {carMaintenance.price} <br />
                    <RightWrapper>
                        <Icon
                            name={Constants.ICON_EDIT}
                            className={Constants.CLASSNAME_EDITBTN}
                            style={{ color: Constants.COLOR_LIGHT_GRAY, cursor: 'pointer', fontSize: '1.2em' }}
                            onClick={() => editable ? setEditable(false) : setEditable(true)} />
                        <DeleteButton
                            onDelete={onDelete}
                            id={carMaintenance.id}
                        />
                    </RightWrapper>
                </Col>
            </Row>
            <Row>
                <Col>
                    {editable &&
                        <AddMaintenance
                            ID={carMaintenance.id}
                            onClose={() => setEditable(false)}
                            onSave={updateMaintenance} />
                    }
                </Col>
            </Row>
        </>
    )
}