import { useState } from 'react';

import { updateToFirebaseById } from '../../datatier/datatier';
import { DB, VARIANTS } from "../../utils/Constants";
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { useAlert } from '../Hooks/useAlert';
import ListRow from '../Site/ListRow';

import AddGearMaintenanceInstruction from './AddGearMaintenanceInstruction';

export default function GearMaintenanceInstruction({ instruction, onDelete }) {

    //states
    const [editable, setEditable] = useState(false);

    //alert
    const {
        message,
        showMessage,
        error,
        showError,
        clearMessages
    } = useAlert();

    const updateInstruction = (object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(DB.BACKPACKING_GEAR_MAINTENANCE_INSTRUCTIONS, object.id, object);
        setEditable(false);
    }

    return (
        <ListRow
            item={instruction}
            dbKey={DB.BACKPACKING_GEAR_MAINTENANCE_INSTRUCTIONS}
            headerProps={{
                left: <span>{instruction.name}</span>
            }}
            showEditButton={true}
            editable={editable}
            setEditable={setEditable}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={instruction.id}
            alert={{
                message,
                showMessage,
                error,
                showError,
                variant: VARIANTS.SUCCESS,
                onClose: clearMessages,
            }}
            section={
                <pre>
                    {instruction.text}
                </pre>
            }
            modalProps={{
                modalTitle: "Muokkaa ohjetta",
                modalBody: (
                    <AddGearMaintenanceInstruction
                        gearMaintenanceInstructionID={instruction.id}
                        onClose={() => setEditable(false)}
                        onSave={updateInstruction} />
                )
            }}
        />
    )
}



