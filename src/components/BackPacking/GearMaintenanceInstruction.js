import { useState } from 'react';

import { updateToFirebaseById } from '../../datatier/datatier';
import { DB, VARIANTS } from "../../utils/Constants";
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import Alert from '../Alert';
import DeleteButton from '../Buttons/DeleteButton';
import EditButton from '../Buttons/EditButton';
import { useAlert } from '../Hooks/useAlert';
import RightWrapper from '../Site/RightWrapper';

import AddGearMaintenanceInstruction from './AddGearMaintenanceInstruction';

export default function GearMaintenanceInstruction({ instruction, onDelete }) {

    //states
    const [editable, setEditable] = useState(false);

    //alert
    const {
        message, setMessage,
        showMessage, setShowMessage,
        error, setError,
        showError, setShowError,
        clearMessages
    } = useAlert();

    const updateInstruction = (object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(DB.BACKPACKING_GEAR_MAINTENANCE_INSTRUCTIONS, object.id, object);
        setEditable(false);
    }

    return (
        <div className='listContainer'>

            <Alert message={message}
                showMessage={showMessage}
                error={error}
                showError={showError}
                variant={VARIANTS.SUCCESS}
                onClose={clearMessages}
            />

            <h5>
                <span>
                    {instruction.name}
                </span>
                <RightWrapper>
                    <EditButton
                        editable={editable}
                        setEditable={setEditable}
                    />
                    <DeleteButton
                        onDelete={onDelete}
                        id={instruction.id}
                    />
                </RightWrapper>
            </h5>
            <pre>
                {instruction.text}
            </pre>

            {
                editable && <AddGearMaintenanceInstruction
                    gearMaintenanceInstructionID={instruction.id}
                    onClose={() => setEditable(false)}
                    onSave={updateInstruction} />
            }
        </div>
    )
}


