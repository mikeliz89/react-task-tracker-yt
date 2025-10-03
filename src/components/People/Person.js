import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import * as Constants from "../../utils/Constants";
import Icon from '../Icon';
import Alert from '../Alert';

export default function Person({ person, onDelete }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_PEOPLE });

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message] = useState('')
    const [showError, setShowError] = useState(false);
    const [error] = useState('');

    return (
        <div className='listContainer'>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant={Constants.VARIANT_SUCCESS}
                onClose={() => { setShowMessage(false); setShowError(false); }}
            />
            
            <h5>
                <span>
                    {person.name}
                </span>
                <Icon name={Constants.ICON_DELETE} className={Constants.CLASSNAME_DELETEBTN}
                    style={{ color: Constants.COLOR_DELETEBUTTON, cursor: 'pointer', fontSize: '1.2em' }}
                    onClick={() => { if (window.confirm(t('delete_person_confirm_message'))) { onDelete(person.id); } }}
                />
            </h5>
            <p>{t('birthday') + ": "}{person.birthday}</p>
            <p>{person.description}</p>
            <p>
                <Link className='btn btn-primary' to={`${Constants.NAVIGATION_PERSON}/${person.id}`}>{t('view_details')}</Link>
            </p>
        </div>
    )
}