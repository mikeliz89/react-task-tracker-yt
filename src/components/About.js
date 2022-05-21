import GoBackButton from './GoBackButton';
import { useTranslation } from 'react-i18next';

const About = () => {
    const { t } = useTranslation();
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
