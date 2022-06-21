//react
import { DropdownButton, Dropdown, ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
//i18n
import i18n from 'i18next';
//js-cookie
import cookies from 'js-cookie';
//languages
import './Language.css';
import { Languages } from '../../Languages';

export default function Language() {

    const { t } = useTranslation('language', { keyPrefix: 'language' });

    const currentLanguageCode = cookies.get('i18next') || Languages.FI;

    const languages = [
        {
            code: Languages.FI,
            name: 'Suomi',
            country_code: Languages.FI
        },
        {
            code: Languages.EN,
            name: 'English',
            country_code: 'gb'
        }
    ]

    return (
        <>
            <DropdownButton
                as={ButtonGroup}
                id="dropdown-basic-languageBtn"
                title={t('language')}
                variant='success'>
                {languages.map(({ code, name, country_code }) => (
                    <Dropdown.Item key={country_code}>
                        <button
                            className="btn"
                            type="button"
                            id="languageDropDownBtn"
                            onClick={() => i18n.changeLanguage(code)}
                            disabled={code === currentLanguageCode}
                        >
                            <span
                                className={`flag-icon flag-icon-${country_code}`}
                                style={{ opacity: code === currentLanguageCode, marginRight: '5px' }}
                            >
                            </span>
                            {name}
                        </button>
                    </Dropdown.Item>
                ))}
            </DropdownButton>
        </>
    )
}
