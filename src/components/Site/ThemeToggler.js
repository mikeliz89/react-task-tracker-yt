import { useTheme } from '../../contexts/ThemeContext';
import * as Constants from '../../utils/Constants';
import { useTranslation } from 'react-i18next';

export default function ThemeToggler() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_THEME });

    const { toggleTheme, theme } = useTheme();

    return (
        <div className='btn btn-secondary' onClick={() => { toggleTheme(); }}>
            {t('title')}: {t(theme)}
        </div>
    )
}