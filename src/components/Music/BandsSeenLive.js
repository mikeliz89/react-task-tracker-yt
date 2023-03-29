import GoBackButton from '../Buttons/GoBackButton';
import { useTranslation } from 'react-i18next';
import PageTitle from '../Site/PageTitle';
import PageContentWrapper from "../Site/PageContentWrapper";
import * as Constants from '../../utils/Constants';

const BandsSeenLive = () => {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_MUSIC, { keyPrefix: Constants.TRANSLATION_MUSIC });

    return (
        <PageContentWrapper>
            <GoBackButton />
            <PageTitle title={t('bands_seen_live')} />
            <p>Bändit</p>
        </PageContentWrapper>
    )
}

export default BandsSeenLive