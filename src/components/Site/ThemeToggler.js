import React from 'react'
import { useTheme } from '../../contexts/ThemeContext';
import * as Constants from '../../utils/Constants';
import { useTranslation } from 'react-i18next';

function ThemeToggler() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_THEME, { keyPrefix: Constants.TRANSLATION_THEME });

    const { toggleTheme, theme } = useTheme();

    return (
        <div className='btn btn-secondary' onClick={() => {
            toggleTheme();
            const rootElement = document.getElementById("root");
            if (theme === 'light') {
                rootElement.style.backgroundColor = 'black';
            } else {
                rootElement.style.backgroundColor = 'white';
            }
        }}>{t('title')}: {theme}</div>
    )
}

export default ThemeToggler