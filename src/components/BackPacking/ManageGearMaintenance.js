
import { useTranslation } from 'react-i18next';

import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebase } from "../../datatier/datatier";
import { removeFromFirebaseById } from "../../datatier/datatier";
import { TRANSLATION, DB, ICONS, COLORS } from "../../utils/Constants";
import { getCurrentDateAsJson } from "../../utils/DateTimeUtils";
import useFetch from '../Hooks/useFetch';
import { useToggle } from "../Hooks/useToggle";
import ManagePage from "../Site/ManagePage";

import AddGearMaintenanceInstruction from "./AddGearMaintenanceInstruction";
import GearMaintenanceInstructions from "./GearMaintenanceInstructions";

export default function ManageGearMaintenance() {

    //fetch data
    const { data: gearMaintenanceInstructions,
        originalData: originalGearMaintenanceInstructions,
        counter, loading } = useFetch(DB.BACKPACKING_GEAR_MAINTENANCE_INSTRUCTIONS);

    const { status: showAddGearMaintenance, toggleStatus: toggleAddGearMaintenance } = useToggle();

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.BACKPACKING });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //user
    const { currentUser } = useAuth();

    const addGearMaintenanceInstruction = (maintenanceInstruction) => {
        try {
            maintenanceInstruction["created"] = getCurrentDateAsJson();
            maintenanceInstruction["createdBy"] = currentUser.email;
            pushToFirebase(DB.BACKPACKING_GEAR_MAINTENANCE_INSTRUCTIONS, maintenanceInstruction);
        } catch (ex) {
        }
    }

    const deleteInstruction = (id) => {
        removeFromFirebaseById(DB.BACKPACKING_GEAR_MAINTENANCE_INSTRUCTIONS, id);
    }

    return (
        <ManagePage
            loading={loading}
            loadingText={tCommon("loading")}
            title={t('button_manage_gear_maintenance')}
            centerActions={
                showAddGearMaintenance ? (
                    <AddGearMaintenanceInstruction
                        onSave={addGearMaintenanceInstruction}
                        onClose={toggleAddGearMaintenance}
                    />
                ) : null
            }
            addButton={{
                show: showAddGearMaintenance,
                iconName: ICONS.PLUS,
                openColor: COLORS.ADDBUTTON_OPEN,
                closedColor: COLORS.ADDBUTTON_CLOSED,
                openText: tCommon('buttons.button_close'),
                closedText: t('button_add_maintenance_instructions'),
                onToggle: toggleAddGearMaintenance,
            }}
            hasItems={gearMaintenanceInstructions != null && gearMaintenanceInstructions.length > 0}
            emptyText={t('no_gear_maintenance_instructions_to_show')}
        >
            <GearMaintenanceInstructions
                items={gearMaintenanceInstructions}
                originalList={originalGearMaintenanceInstructions}
                counter={counter}
                onDelete={deleteInstruction}
            />
        </ManagePage>
    )
}


