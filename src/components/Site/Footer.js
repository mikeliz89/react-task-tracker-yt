import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as Constants from '../../utils/Constants';

export default function Footer() {

    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_FOOTER })

    return (
        <footer>
            <p>{t('copyright')} &copy; 2023</p>
            <Link to={Constants.NAVIGATION_ABOUT}>{t('about')}</Link>
        </footer>
    )
}
