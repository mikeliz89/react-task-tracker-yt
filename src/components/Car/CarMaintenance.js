import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { getJsonAsDateTimeString, getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { TRANSLATION, DB } from '../../utils/Constants';
import DeleteButton from '../Buttons/DeleteButton';
import EditButton from '../Buttons/EditButton';
import AddMaintenance from "./AddMaintenance";
import { updateToFirebaseById } from "../../datatier/datatier";
import RightWrapper from "../Site/RightWrapper";
import { useToggle } from '../useToggle';

export default function CarMaintenance({ carMaintenance, onDelete }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.CAR });

    //states
    const { status: editable, toggleStatus: toggleEditable, setFalse } = useToggle();

    const updateMaintenance = (maintenance) => {
        maintenance["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(DB.CAR_MAINTENANCE, carMaintenance.id, maintenance);
        setFalse(); //Sulje edit tila
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
                        <EditButton
                            editable={editable}
                            setEditable={toggleEditable}
                        />
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
                            onClose={() => toggleEditable()}
                            onSave={updateMaintenance} />
                    }
                </Col>
            </Row>
        </>
    )
}