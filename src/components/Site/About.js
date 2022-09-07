import GoBackButton from '../GoBackButton';
import { useTranslation } from 'react-i18next';
import PageTitle from '../PageTitle';
import PageContentWrapper from '../PageContentWrapper';
import * as Constants from '../../utils/Constants';

const About = () => {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_ABOUT, { keyPrefix: Constants.TRANSLATION_ABOUT });

    return (
        <PageContentWrapper>
            <GoBackButton />
            <PageTitle title={t('about_version') + ' 2.0.1'} />
            <p>{t('version_upgraded')} 9.8.2022</p>
            <p>{t('about_author')} Miika Kontio</p>
        </PageContentWrapper>
    )
}

export default About