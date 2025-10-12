import { useTranslation } from 'react-i18next';
import { TRANSLATION, NAVIGATION } from '../../utils/Constants';
import NavButton from '../Buttons/NavButton';

export default function Footer() {

    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.FOOTER })

    return (
        <footer>
            <p>{t('copyright')} &copy; 2025</p>
            <NavButton to={NAVIGATION.ABOUT} className=''>
                {t('about')}
            </NavButton>
        </footer>
    )
}
