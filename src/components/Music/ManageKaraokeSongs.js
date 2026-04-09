


// TODO: Luo KaraokeSongs-komponentti, joka näyttää yksittäiset kappaleet
// import KaraokeSongs from './KaraokeSongs';
// TODO: Luo AddKaraokeSong-komponentti lisäystä varten


import { useTranslation } from 'react-i18next';

import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebase, removeFromFirebaseById, updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION, VARIANTS } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import NavButton from '../Buttons/NavButton';
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
import { useToggle } from '../Hooks/useToggle';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { SortMode } from '../SearchSortFilter/SortModes';
import Counter from '../Site/Counter';
import ManagePage from '../Site/ManagePage';

import AddKaraokeSong from './AddKaraokeSong';

export default function ManageKaraokeSongs() {
    // translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MUSIC });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    // fetch data
    const { data: songs, setData: setSongs,
        originalData: originalSongs, counter, loading } = useFetch(DB.MUSIC_KARAOKE_SONGS);

    // modal
    const { status: showAddSong, toggleStatus: toggleAddSong } = useToggle();

    // alert
    const {
        message, setMessage,
        showMessage, setShowMessage,
        error, setError,
        showError, setShowError,
        clearMessages,
        showSuccess,
        showFailure
    } = useAlert();

    // user
    const { currentUser } = useAuth();

    const deleteSong = async (id) => {
        removeFromFirebaseById(DB.MUSIC_KARAOKE_SONGS, id);
    }

    const addSong = async (songID, song) => {
        try {
            clearMessages();
            song["created"] = getCurrentDateAsJson();
            song["createdBy"] = currentUser.email;
            pushToFirebase(DB.MUSIC_KARAOKE_SONGS, song);
            showSuccess(t('save_success'));
        } catch (ex) {
            showFailure(t('save_exception'));
            console.warn(ex);
        }
    }

    const editSong = (song) => {
        const id = song.id;
        updateToFirebaseById(DB.MUSIC_KARAOKE_SONGS, id, song);
    }

    return (
        <ManagePage
            loading={loading}
            loadingText={tCommon("loading")}
            title={t('karaoke_songs_title')}
            topActions={(
                <>
                    <NavButton to={NAVIGATION.MANAGE_MUSICLISTS}
                        icon={ICONS.LIST_ALT}>
                        {t('button_music_lists')}
                    </NavButton>
                </>
            )}
            alert={{
                message,
                showMessage,
                error,
                showError,
                variant: VARIANTS.SUCCESS,
                onClose: clearMessages,
            }}
            modal={{
                show: showAddSong,
                onHide: toggleAddSong,
                title: t('modal_header_add_karaoke_song'),
                body: (
                    <>
                        <AddKaraokeSong onSave={addSong} onClose={toggleAddSong} />
                        {/* Lisää AddKaraokeSong-komponentti kun olet luonut sen */}
                    </>
                ),
            }}
            searchSortFilter={{
                onSet: setSongs,
                originalList: originalSongs,
                showSearchByText: false,
                showSearchByDescription: false,
                defaultSort: SortMode.Name_ASC,
                showSortByName: false,
                showSortByStarRating: false,
                showSortByCreatedDate: false,
                filterMode: FilterMode.Name,
            }}
            addButton={{
                show: showAddSong,
                iconName: ICONS.PLUS,
                openColor: COLORS.ADDBUTTON_OPEN,
                closedColor: COLORS.ADDBUTTON_CLOSED,
                openText: tCommon('buttons.button_close'),
                closedText: t('button_add_karaoke_song'),
                onToggle: toggleAddSong,
            }}
            hasItems={songs != null && songs.length > 0}
            emptyText={t('no_karaoke_songs_to_show')}
        >
            <>
                <Counter list={songs} originalList={originalSongs} counter={counter} />
                {/* <KaraokeSongs songs={songs} onDelete={deleteSong} onEdit={editSong} /> */}
                {/* Lisää KaraokeSongs-komponentti kun olet luonut sen */}
            </>
        </ManagePage>
    )
}


