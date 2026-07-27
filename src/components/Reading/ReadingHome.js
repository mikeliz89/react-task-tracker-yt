import { useTranslation } from 'react-i18next';

import GoBackButton from '../Buttons/GoBackButton';
import PageContentWrapper from '../Site/PageContentWrapper';
import PageTitle from '../Site/PageTitle';
import { TRANSLATION } from '../../utils/Constants';

export default function ReadingHome() {
    const { t } = useTranslation(TRANSLATION.DASHBOARD, { keyPrefix: TRANSLATION.DASHBOARD_BUTTONS });
    const { t: tCommon } = useTranslation(TRANSLATION.TRANSLATION);

    return (
        <PageContentWrapper>
            <GoBackButton />
            <PageTitle title={t('reading')} />
            <p>{tCommon('coming_soon')}</p>
        </PageContentWrapper>
    );
}
