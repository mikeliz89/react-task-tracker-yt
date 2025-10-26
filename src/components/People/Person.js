import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { TRANSLATION, NAVIGATION } from "../../utils/Constants";
import Alert from '../Alert';
import DeleteButton from '../Buttons/DeleteButton';
import { useAlert } from '../Hooks/useAlert';

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
                <DeleteButton
                    onDelete={onDelete}
                    id={person.id}
                />
            </h5>
            <p>{t('birthday') + ": "}{person.birthday}</p>
            <p>{person.description}</p>
            <p>
                <Link className='btn btn-primary' to={`${NAVIGATION.PERSON}/${person.id}`}>{t('view_details')}</Link>
            </p>
        </div>
    )
}