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
            const htmlElement = document.documentElement;
            if (theme === Constants.THEME_LIGHT) {
                rootElement.style.backgroundColor = Constants.THEME_BLACK;
                htmlElement.style.backgroundColor = Constants.THEME_BLACK;
            } else {
                rootElement.style.backgroundColor = Constants.THEME_WHITE;
                htmlElement.style.backgroundColor = Constants.THEME_WHITE;
            }
        }}>{t('title')}: {theme}</div>
    )
}

export default ThemeToggler