import { useTranslation } from 'react-i18next';
import * as Constants from '../../utils/Constants';
import NavButton from '../Buttons/NavButton';

export default function Footer() {

    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_FOOTER })

    return (
        <footer>
            <p>{t('copyright')} &copy; 2025</p>
            <NavButton to={Constants.NAVIGATION_ABOUT} className=''>
                {t('about')}
            </NavButton>
        </footer>
    )
}
