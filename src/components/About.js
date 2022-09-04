//buttons
import GoBackButton from './GoBackButton';
//react
import { useTranslation } from 'react-i18next';
//pagetitle
import PageTitle from './PageTitle';
import PageContentWrapper from './PageContentWrapper';

const About = () => {

    //translation
    const { t } = useTranslation('about', { keyPrefix: 'about' });

    return (
        <div>
            <GoBackButton />
            <PageTitle title={t('about_version') + ' 2.0.1'} />
            <PageContentWrapper>
                <p>{t('version_upgraded')} 9.8.2022</p>
                <p>{t('about_author')} Miika Kontio</p>
            </PageContentWrapper>
        </div>
    )
}

export default About
