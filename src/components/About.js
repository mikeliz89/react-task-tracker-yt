//buttons
import GoBackButton from './GoBackButton';
//react
import { useTranslation } from 'react-i18next';

const About = () => {

    //translation
    const { t } = useTranslation('about', { keyPrefix: 'about' });

    return (
        <div>
            <GoBackButton />
            <div className="page-content">
                <h4>{t('about_version')} 2.0.0</h4>
                <p>{t('about_author')} Miika Kontio</p>
            </div>
        </div>
    )
}

export default About
