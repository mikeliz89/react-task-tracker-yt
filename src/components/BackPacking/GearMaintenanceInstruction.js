import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import * as Constants from "../../utils/Constants";
import Icon from '../Icon';
import Alert from '../Alert';
import RightWrapper from '../Site/RightWrapper';
import AddGearMaintenanceInstruction from './AddGearMaintenanceInstruction';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { updateToFirebaseById } from '../../datatier/datatier';

export default function GearMaintenanceInstruction({ instruction, onDelete }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_BACKPACKING, { keyPrefix: Constants.TRANSLATION_BACKPACKING });

    //states
    const [editable, setEditable] = useState(false);

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message] = useState('')
    const [showError, setShowError] = useState(false);
    const [error] = useState('');

    const updateInstruction = (object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(Constants.DB_BACKPACKING_GEAR_MAINTENANCE_INSTRUCTIONS, object.id, object);
        setEditable(false);
    }

    return (
        <div className='listContainer'>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

            <h5>
                <span>
                    {instruction.name}
                </span>
                <RightWrapper>
                    <Icon name={Constants.ICON_EDIT} className="editBtn" style={{ color: 'light-gray', cursor: 'pointer', fontSize: '1.2em' }}
                        onClick={() => editable ? setEditable(false) : setEditable(true)} />
                    <Icon name={Constants.ICON_DELETE} className="deleteBtn"
                        style={{ color: Constants.COLOR_DELETEBUTTON, cursor: 'pointer', fontSize: '1.2em' }}
                        onClick={() => { if (window.confirm(t('delete_gearinstruction_confirm_message'))) { onDelete(instruction.id); } }} />
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