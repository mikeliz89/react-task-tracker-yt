import GoBackButton from '../Buttons/GoBackButton';
import { useTranslation } from 'react-i18next';
import PageTitle from '../Site/PageTitle';
import PageContentWrapper from '../Site/PageContentWrapper';
import { TRANSLATION } from '../../utils/Constants';

export default function About() {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.ABOUT });

    return (
        <PageContentWrapper>
            <GoBackButton />
            <PageTitle title={t('about_version') + ' 2.2.1'} />
            <p>{t('version_upgraded')} 6.10.2025</p>
            <p>{t('about_author')} Miika Kontio</p>
        </PageContentWrapper>
    )
}
