import { useTranslation } from 'react-i18next';
import { TRANSLATION, DB, ICONS, NAVIGATION } from '../../utils/Constants';
import NavButton from '../Buttons/NavButton';
import ManageGeneric from '../Common/ManageGeneric';
import AddKaraokeSong from './AddKaraokeSong';
import KaraokeSong from './KaraokeSong';

export default function ManageKaraokeSongs() {

    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MUSIC });
    return (
        <ManageGeneric
            dbKey={DB.MUSIC_KARAOKE_SONGS}
            translationKey={TRANSLATION.MUSIC}
            AddComponent={AddKaraokeSong}
            ListComponentProps={{ ItemComponent: KaraokeSong }}
            iconName={ICONS.MUSIC}
            title={t('karaoke_songs_title')}
            modalTitle={t('modal_header_add_karaoke_song')}
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
                showFilterHaveRated: true,
            }}
            copyButton={{ showCopyButton: true }}
        />
    );
}


