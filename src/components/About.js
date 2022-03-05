import GoBackButton from './GoBackButton';
import { useTranslation } from 'react-i18next';

const About = () => {
    const { t } = useTranslation();
    return (
        <div>
            <GoBackButton  />
            <h4>{t('about_version')} 1.0.1</h4>
            <p>{t('about_author')} Miika Kontio</p>
        </div>
    )
}

export default About
