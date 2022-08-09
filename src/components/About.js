//buttons
import GoBackButton from './GoBackButton';
//react
import { useTranslation } from 'react-i18next';
import PageTitle from './PageTitle';

const About = () => {

    //translation
    const { t } = useTranslation('about', { keyPrefix: 'about' });

    return (
        <div>
            <GoBackButton />
            <PageTitle title={t('about_version') + ' 2.0.1'}  />
            <div className="page-content">
                <p>{t('version_upgraded')} 9.8.2022</p>
                <p>{t('about_author')} Miika Kontio</p>
            </div>
        </div>
    )
}

export default About
