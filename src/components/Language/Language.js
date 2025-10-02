import { DropdownButton, Dropdown, ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import cookies from 'js-cookie';
import './Language.css';
import { Languages } from '../../Languages';
import * as Constants from '../../utils/Constants';

export default function Language() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_LANGUAGE });

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
                variant={Constants.VARIANT_SUCCESS}>
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
