
import { useTranslation } from 'react-i18next';
import { TRANSLATION, DB, ICONS } from "../../utils/Constants";
import ManageGeneric from '../Common/ManageGeneric';
import AddGearMaintenanceInstruction from "./AddGearMaintenanceInstruction";
import GearMaintenanceInstructions from "./GearMaintenanceInstructions";

export default function ManageGearMaintenance() {
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.BACKPACKING });
    return (
        <ManageGeneric
            dbKey={DB.BACKPACKING_GEAR_MAINTENANCE_INSTRUCTIONS}
            translationKey={TRANSLATION.BACKPACKING}
            AddComponent={AddGearMaintenanceInstruction}
            ListComponent={GearMaintenanceInstructions}
            iconName={ICONS.WRENCH}
            title={t('button_manage_gear_maintenance')}
            copyButton={{ showCopyButton: true }}
        />
    );
}


