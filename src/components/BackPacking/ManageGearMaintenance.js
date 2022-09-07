import { Row, ButtonGroup } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import { useState } from "react";
import { db } from '../../firebase-config';
import { ref } from 'firebase/database';
import Button from "../Button";
import GoBackButton from "../GoBackButton";
import PageContentWrapper from "../PageContentWrapper";
import PageTitle from "../PageTitle";
import AddGearMaintenanceInstruction from "./AddGearMaintenanceInstruction";
import * as Constants from "../../utils/Constants";
import { getCurrentDateAsJson } from "../../utils/DateTimeUtils";
import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebase } from "../../datatier/datatier";

function ManageGearMaintenance() {

    //states
    const [showAdd, setShowAdd] = useState(false);

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_BACKPACKING, { keyPrefix: Constants.TRANSLATION_BACKPACKING });

    //user
    const { currentUser } = useAuth();

    const addGearMaintenanceInstruction = (maintenanceInstruction) => {
        try {
            // clearMessages();
            maintenanceInstruction["created"] = getCurrentDateAsJson();
            maintenanceInstruction["createdBy"] = currentUser.email;
            pushToFirebase(Constants.DB_GEAR_MAINTENANCE_INSTRUCTIONS, maintenanceInstruction);
            //setMessage(t('save_success'));
            //setShowMessage(true);
        } catch (ex) {
            //setError(t('save_exception'));
            //setShowError(true);
        }
    }

    return (
        <PageContentWrapper>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        iconName='plus'
                        color={showAdd ? 'red' : 'green'}
                        text={t('button_add_maintenance_instructions')} className='btn btn-primary'
                        onClick={() => setShowAdd(!showAdd)} />
                </ButtonGroup>
            </Row>

            <PageTitle title={t('button_manage_gear_maintenance')} />

            {
                showAdd && <AddGearMaintenanceInstruction onSave={addGearMaintenanceInstruction} onClose={() => setShowAdd(false)} />
            }
        </PageContentWrapper>
    )
}

export default ManageGearMaintenance