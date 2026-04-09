import { useTranslation } from 'react-i18next';


import { useTheme } from '../../contexts/ThemeContext';
import { TRANSLATION } from '../../utils/Constants';

export default function ThemeToggler() {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.THEME });
const { toggleTheme, theme } = useTheme();

    return (
        <div className='btn btn-secondary' onClick={() => { toggleTheme(); }}>
            {t('title')}: {t(theme)}
        </div>
    )
}


