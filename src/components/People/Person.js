import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TRANSLATION, NAVIGATION, DB } from "../../utils/Constants";
import { Languages } from '../../Languages';
import { getCurrentDateAsJson, getJsonAsDateString } from '../../utils/DateTimeUtils';
import { updateToFirebaseById } from '../../datatier/datatier';
import Alert from '../Alert';
import AddPerson from './AddPerson';
import DeleteButton from '../Buttons/DeleteButton';
import EditButton from '../Buttons/EditButton';
import { useAlert } from '../Hooks/useAlert';
import RightWrapper from '../Site/RightWrapper';

export default function Person({ person, onDelete }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.PEOPLE });

    //alert
    const {
        message, setMessage,
        showMessage, setShowMessage,
        error, setError,
        showError, setShowError,
        clearMessages
    } = useAlert();

    //states
    const [editable, setEditable] = useState(false);

    const updatePerson = (object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(DB.PEOPLE, person.id, object);
        setEditable(false);
    }

    return (
        <div className='listContainer'>

            <Alert
                message={message}
                showMessage={showMessage}
                error={error}
                showError={showError}
                onClose={clearMessages}
            />

            <h5>
                <span>
                    {person.name}
                </span>
                <RightWrapper>
                    <EditButton
                        editable={editable}
                        setEditable={setEditable}
                    />
                    <DeleteButton
                        onDelete={onDelete}
                        id={person.id}
                    />
                </RightWrapper>
            </h5>

            {
                !editable && (
                    <>
                        <p>{t('birthday') + ": "}{getJsonAsDateString(person.birthday, Languages.FI)}</p>
                        <p>{person.description}</p>
                        <p>
                            <Link className='btn btn-primary' to={`${NAVIGATION.PERSON}/${person.id}`}>{t('view_details')}</Link>
                        </p>
                    </>
                )
            }

            {
                editable && (
                    <AddPerson
                        personID={person.id}
                        onSave={updatePerson}
                        onClose={() => setEditable(false)}
                    />
                )
            }
        </div>
    )
}