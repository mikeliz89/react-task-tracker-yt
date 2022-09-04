//buttons
import GoBackButton from "../GoBackButton";
//react
import { useTranslation } from 'react-i18next';
//pagetitle
import PageTitle from "../PageTitle";
import PageContentWrapper from "../PageContentWrapper";

const BandsSeenLive = () => {

    //translation
    const { t } = useTranslation('music', { keyPrefix: 'music' });

    return (
        <div>
            <GoBackButton />
            <PageTitle title={t('bands_seen_live')} />
            <PageContentWrapper>
                <p>Bändit</p>
            </PageContentWrapper>
        </div>
    )
}

export default BandsSeenLive