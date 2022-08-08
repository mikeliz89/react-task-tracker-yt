//buttons
import GoBackButton from "../GoBackButton";
//react
import { useTranslation } from 'react-i18next';

const BandsSeenLive = () => {

    //translation
    const { t } = useTranslation('music', { keyPrefix: 'music' });

    return (
        <div>
            <GoBackButton />
            <h3 className="page-title">{t('bands_seen_live')}</h3>
            <div className="page-content">
                <p>Bändit</p>
            </div>
        </div>
    )
}

export default BandsSeenLive