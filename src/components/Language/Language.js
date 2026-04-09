import i18n from 'i18next';
import cookies from 'js-cookie';
import { DropdownButton, Dropdown, ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { Languages } from '../../Languages';
import { TRANSLATION, VARIANTS } from '../../utils/Constants';

import './Language.css';

export default function Language() {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.LANGUAGE });

const currentLanguageCode = ((cookies.get('i18next') || Languages.FI).split('-')[0] || Languages.FI).toLowerCase();

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
    ];

    const selectedLanguage =
        languages.find(({ code }) => code === currentLanguageCode) || languages[0];

    return (
        <>
            <DropdownButton
                as={ButtonGroup}
                id="dropdown-basic-languageBtn"
                title={(
                    <>
                        <span
                            className={`flag-icon flag-icon-${selectedLanguage.country_code}`}
                            style={{ marginRight: '6px' }}
                        />
                        {t('language')}
                    </>
                )}
                variant={VARIANTS.SUCCESS}>
                {languages.map(({ code, name, country_code }) => (
                    <Dropdown.Item
                        as="button"
                        type="button"
                        key={code}
                        id="languageDropDownBtn"
                        active={code === currentLanguageCode}
                        className={`language-dropdown-item ${code === currentLanguageCode ? 'language-dropdown-item--active' : ''}`}
                        onClick={() => {
                            if (code !== currentLanguageCode) {
                                i18n.changeLanguage(code);
                            }
                        }}
                    >
                        <span
                            className={`flag-icon flag-icon-${country_code}`}
                            style={{ opacity: code === currentLanguageCode ? 1 : 0.65, marginRight: '6px' }}
                        />
                        {name}
                    </Dropdown.Item>
                ))}
            </DropdownButton>
        </>
    )
}



