import GoBackButton from '../Buttons/GoBackButton';
import { useTranslation } from 'react-i18next';
import PageTitle from '../Site/PageTitle';
import PageContentWrapper from '../Site/PageContentWrapper';
import * as Constants from '../../utils/Constants';

const About = () => {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_ABOUT, { keyPrefix: Constants.TRANSLATION_ABOUT });

    return (
        <PageContentWrapper>
            <GoBackButton />
            <PageTitle title={t('about_version') + ' 2.2.0'} />
            <p>{t('version_upgraded')} 13.8.2023</p>
            <p>{t('about_author')} Miika Kontio</p>
        </PageContentWrapper>
    )
}

export default About
