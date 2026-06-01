import { useState } from 'react';

import { updateToFirebaseById } from '../../datatier/datatier';
import { DB, VARIANTS } from "../../utils/Constants";
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { useAlert } from '../Hooks/useAlert';
import ListRow from '../Site/ListRow';

import AddGearMaintenanceInstruction from './AddGearMaintenanceInstruction';

export default function GearMaintenanceInstruction({ item, onDelete, onEdit  }) {

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

    const updateInstruction = (id, payload) => {
        payload["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(DB.BACKPACKING_GEAR_MAINTENANCE_INSTRUCTIONS, id, payload);
        setEditable(false);
    }

    return (
        <ListRow
            item={item}
            dbKey={DB.BACKPACKING_GEAR_MAINTENANCE_INSTRUCTIONS}
            headerProps={{
                title: <span>{item.name}</span>
            }}
            showEditButton={true}
            editable={editable}
            setEditable={setEditable}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={item.id}
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
                    {item.text}
                </pre>
            }
            modalProps={{
                modalTitle: "Muokkaa ohjetta",
                modalBody: (
                    <AddGearMaintenanceInstruction
                        gearMaintenanceInstructionID={item.id}
                        onClose={() => setEditable(false)}
                        onSave={updateInstruction} />
                )
            }}
        />
    )
}



