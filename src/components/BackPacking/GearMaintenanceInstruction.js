import { useState } from 'react';
import { DB, VARIANTS } from "../../utils/Constants";
import DeleteButton from '../Buttons/DeleteButton';
import EditButton from '../Buttons/EditButton';
import Alert from '../Alert';
import RightWrapper from '../Site/RightWrapper';
import AddGearMaintenanceInstruction from './AddGearMaintenanceInstruction';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { updateToFirebaseById } from '../../datatier/datatier';

export default function GearMaintenanceInstruction({ instruction, onDelete }) {

    //states
    const [editable, setEditable] = useState(false);

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message] = useState('')
    const [showError, setShowError] = useState(false);
    const [error] = useState('');

    const updateInstruction = (object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(DB.BACKPACKING_GEAR_MAINTENANCE_INSTRUCTIONS, object.id, object);
        setEditable(false);
    }

    return (
        <div className='listContainer'>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant={VARIANTS.SUCCESS} onClose={() => { setShowMessage(false); setShowError(false); }}
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