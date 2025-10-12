import { DropdownButton, Dropdown, ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import cookies from 'js-cookie';
import './Language.css';
import { Languages } from '../../Languages';
import { TRANSLATION, VARIANTS } from '../../utils/Constants';

export default function Language() {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.LANGUAGE });

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
                variant={VARIANTS.SUCCESS}>
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
