import { useTranslation } from 'react-i18next';
import { TRANSLATION, DB, ICONS, NAVIGATION } from '../../utils/Constants';
import NavButton from '../Buttons/NavButton';
import ManageGeneric from '../Common/ManageGeneric';
import AddBand from './AddBand';
import Bands from './Bands';

export default function ManageMusicBands() {

    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MUSIC });
    return (
        <ManageGeneric
            dbKey={DB.MUSIC_BANDS}
            translationKey={TRANSLATION.MUSIC}
            AddComponent={AddBand}
            ListComponent={Bands}
            iconName={ICONS.MUSIC}
            title={t('music_bands_title')}
            modalTitle={t('modal_header_add_band')}
            topActions={
                <NavButton to={NAVIGATION.MANAGE_MUSICLISTS} icon={ICONS.LIST_ALT}>
                    {t('button_music_lists')}
                </NavButton>
            }
            searchSortFilterOptions={{
                showSearchByText: true,
                showSearchByDescription: true,
                defaultSort: 'Name_ASC',
                showSortByName: true,
                showSortByStarRating: true,
                showSortByCreatedDate: true,
                filterMode: 'Name',
                showFilterSeenLive: true,
                showFilterHaveRated: true,
            }}
            copyButton={{ showCopyButton: true }}
        />
    );
}



