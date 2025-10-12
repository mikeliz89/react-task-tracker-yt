import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION, VARIANTS } from "../../utils/Constants";
import Alert from '../Alert';
import DeleteButton from '../Buttons/DeleteButton';

export default function Person({ person, onDelete }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.PEOPLE });

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message] = useState('')
    const [showError, setShowError] = useState(false);
    const [error] = useState('');

    return (
        <div className='listContainer'>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant={VARIANTS.SUCCESS}
                onClose={() => { setShowMessage(false); setShowError(false); }}
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