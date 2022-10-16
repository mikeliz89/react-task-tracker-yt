import React from 'react'
import { useTheme } from '../../contexts/ThemeContext';
import * as Constants from '../../utils/Constants';
import { useTranslation } from 'react-i18next';

function ThemeToggler() {

    const LIGHT = 'light';
    const BLACK = 'black';
    const WHITE = 'white';

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_THEME, { keyPrefix: Constants.TRANSLATION_THEME });

    const { toggleTheme, theme } = useTheme();

    return (
        <div className='btn btn-secondary' onClick={() => {
            toggleTheme();
            const rootElement = document.getElementById("root");
            const htmlElement = document.documentElement;
            if (theme === LIGHT) {
                rootElement.style.backgroundColor = BLACK;
                htmlElement.style.backgroundColor = BLACK;
            } else {
                rootElement.style.backgroundColor = WHITE;
                htmlElement.style.backgroundColor = WHITE;
            }
        }}>{t('title')}: {theme}</div>
    )
}

export default ThemeToggler