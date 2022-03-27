import i18n from 'i18next'
import Dropdown from 'react-bootstrap/Dropdown'
import { useTranslation } from 'react-i18next'
import cookies from 'js-cookie';

export default function Language() {

    const { t } = useTranslation();
    const currentLanguageCode = cookies.get('i18next') || 'fi';

    const languages = [
        {
            code: 'fi',
            name: 'Suomi',
            country_code: 'fi'
        }, 
        {
            code: 'en',
            name: 'English',
            country_code: 'gb'
        }
    ]

    return (
    <>   
        <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                {t('language')}
            </Dropdown.Toggle>
            <Dropdown.Menu>
            {languages.map(({code, name, country_code}) => (
                <Dropdown.Item key={country_code}>
                <button 
                className="btn"
                type="button"
                id="languageDropDownBtn"
                onClick={() => i18n.changeLanguage(code)}
                disabled={code === currentLanguageCode }
                >
                <span 
                className={`flag-icon flag-icon-${country_code}`}
                style={{ opacity: code === currentLanguageCode, marginRight:'5px' }}
                >
                </span>
                {name}
                </button>
                </Dropdown.Item>
            ))}
            </Dropdown.Menu>
        </Dropdown>
    </>
    )
}