//buttons
import GoBackButton from "../GoBackButton";
//react
import { useTranslation } from 'react-i18next';
//pagetitle
import PageTitle from "../PageTitle";

const BandsSeenLive = () => {

    //translation
    const { t } = useTranslation('music', { keyPrefix: 'music' });

    return (
        <div>
            <GoBackButton />
            <PageTitle title={t('bands_seen_live')} />
            <div className="page-content">
                <p>Bändit</p>
            </div>
        </div>
    )
}

export default BandsSeenLive