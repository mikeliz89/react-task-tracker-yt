// TODO: Luo KaraokeSongs-komponentti, joka näyttää yksittäiset kappaleet
// import KaraokeSongs from './KaraokeSongs';
// TODO: Luo AddKaraokeSong-komponentti lisäystä varten

import { useTranslation } from 'react-i18next';
import { TRANSLATION, DB, ICONS, NAVIGATION } from '../../utils/Constants';
import NavButton from '../Buttons/NavButton';
import ManageGeneric from '../Common/ManageGeneric';
import AddKaraokeSong from './AddKaraokeSong';
import Counter from '../Site/Counter';

export default function ManageKaraokeSongs() {

    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MUSIC });
    return (
        <ManageGeneric
            dbKey={DB.MUSIC_KARAOKE_SONGS}
            translationKey={TRANSLATION.MUSIC}
            AddComponent={AddKaraokeSong}
            iconName={ICONS.MUSIC}
            title={t('karaoke_songs_title')}
            AddComponentModalTitle={t('modal_header_add_karaoke_song')}
            topActions={
                <NavButton to={NAVIGATION.MANAGE_MUSICLISTS} icon={ICONS.LIST_ALT}>
                    {t('button_music_lists')}
                </NavButton>
            }
            searchSortFilterOptions={{
                showSearchByText: false,
                showSearchByDescription: false,
                defaultSort: 'Name_ASC',
                showSortByName: false,
                showSortByStarRating: false,
                showSortByCreatedDate: false,
                filterMode: 'Name',
            }}
            ListComponent={Counter}
            ListComponentProps={{}}
        />
    );
}


