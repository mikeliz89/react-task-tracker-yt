//react
import { Row, ButtonGroup } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import { useState } from "react";
//firebase
import { db } from '../../firebase-config';
import { ref, push } from 'firebase/database';
//buttons
import Button from "../Button";
import GoBackButton from "../GoBackButton";
//page
import PageContentWrapper from "../PageContentWrapper";
//pagetitle
import PageTitle from "../PageTitle";
//backpacking
import AddGearMaintenanceInstruction from "./AddGearMaintenanceInstruction";
//utils
import * as Constants from "../../utils/Constants";
import { getCurrentDateAsJson } from "../../utils/DateTimeUtils";
//auth
import { useAuth } from '../../contexts/AuthContext';

function ManageGearMaintenance() {

    //states
    const [showAdd, setShowAdd] = useState(false);

    //translation
    const { t } = useTranslation('backpacking', { keyPrefix: 'backpacking' });

    //user
    const { currentUser } = useAuth();

    const addGearMaintenanceInstruction = (maintenanceInstruction) => {
        try {
            // clearMessages();
            maintenanceInstruction["created"] = getCurrentDateAsJson();
            maintenanceInstruction["createdBy"] = currentUser.email;
            const dbref = ref(db, Constants.DB_GEAR_MAINTENANCE_INSTRUCTIONS);
            push(dbref, maintenanceInstruction);
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