import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import * as Constants from "../../utils/Constants";
import Icon from '../Icon';
import Alert from '../Alert';
import RightWrapper from '../RightWrapper';
import AddGearMaintenanceInstruction from './AddGearMaintenanceInstruction';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { updateToFirebaseById } from '../../datatier/datatier';

const GearMaintenanceInstruction = ({ instruction, onDelete }) => {

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
                    <Icon name='edit' className="editBtn" style={{ color: 'light-gray', cursor: 'pointer', fontSize: '1.2em' }}
                        onClick={() => editable ? setEditable(false) : setEditable(true)} />
                    <Icon name='times' className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
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
            {/* <p>
                <Link className='btn btn-primary' to={`${Constants.NAVIGATION_GEAR}/${gear.id}`}>{t('view_details')}</Link>
            </p> */}
            {/* <StarRating starCount={gear.stars} /> */}
        </div>
    )
}

export default GearMaintenanceInstruction