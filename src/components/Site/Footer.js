import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as Constants from '../../utils/Constants';

const Footer = () => {

    const { t } = useTranslation(Constants.TRANSLATION_FOOTER, { keyPrefix: Constants.TRANSLATION_FOOTER })

    return (
        <footer>
            <p>{t('copyright')} &copy; 2022</p>
            <Link to={Constants.NAVIGATION_ABOUT}>{t('about')}</Link>
        </footer>
    )
}

export default Footer
