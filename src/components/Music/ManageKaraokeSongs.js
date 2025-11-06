import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Modal } from 'react-bootstrap';
import Button from '../Buttons/Button';
import GoBackButton from '../Buttons/GoBackButton';
import PageContentWrapper from '../Site/PageContentWrapper';
import PageTitle from '../Site/PageTitle';
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION, VARIANTS } from '../../utils/Constants';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import CenterWrapper from '../Site/CenterWrapper';
import Counter from '../Site/Counter';
import Alert from '../Alert';
import { pushToFirebase, removeFromFirebaseById, updateToFirebaseById } from '../../datatier/datatier';
import { useAuth } from '../../contexts/AuthContext';
import { SortMode } from '../SearchSortFilter/SortModes';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { useToggle } from '../Hooks/useToggle';
import useFetch from '../Hooks/useFetch';
import NavButton from '../Buttons/NavButton';
import { useAlert } from '../Hooks/useAlert';
import AddKaraokeSong from './AddKaraokeSong';

// TODO: Luo KaraokeSongs-komponentti, joka näyttää yksittäiset kappaleet
// import KaraokeSongs from './KaraokeSongs';
// TODO: Luo AddKaraokeSong-komponentti lisäystä varten

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

    return loading ? (
        <h3>{tCommon("loading")}</h3>
    ) : (
        <PageContentWrapper>
            <PageTitle title={t('karaoke_songs_title')} />

            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <NavButton to={NAVIGATION.MANAGE_MUSICLISTS}
                        icon={ICONS.LIST_ALT}>
                        {t('button_music_lists')}
                    </NavButton>
                </ButtonGroup>
            </Row>

            <Alert
                message={message}
                showMessage={showMessage}
                error={error}
                showError={showError}
                variant={VARIANTS.SUCCESS}
                onClose={clearMessages}
            />

            <Modal show={showAddSong} onHide={toggleAddSong}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modal_header_add_karaoke_song')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddKaraokeSong onSave={addSong} onClose={toggleAddSong} />
                    {/* Lisää AddKaraokeSong-komponentti kun olet luonut sen */}
                </Modal.Body>
            </Modal>

            {
                originalSongs != null && originalSongs.length > 0 ? (
                    <SearchSortFilter
                        onSet={setSongs}
                        originalList={originalSongs}
                        showSearchByText={false}
                        showSearchByDescription={false}
                        defaultSort={SortMode.Name_ASC}
                        showSortByName={false}
                        showSortByStarRating={false}
                        showSortByCreatedDate={false}
                        filterMode={FilterMode.Name}
                    />
                ) : (<></>)
            }

            <CenterWrapper>
                <Button
                    iconName={ICONS.PLUS}
                    color={showAddSong ? COLORS.ADDBUTTON_OPEN : COLORS.ADDBUTTON_CLOSED}
                    text={showAddSong ? tCommon('buttons.button_close') : t('button_add_karaoke_song')}
                    onClick={toggleAddSong} />
            </CenterWrapper>

            {
                songs != null && songs.length > 0 ? (
                    <>
                        <Counter list={songs} originalList={originalSongs} counter={counter} />
                        {/* <KaraokeSongs songs={songs} onDelete={deleteSong} onEdit={editSong} /> */}
                        {/* Lisää KaraokeSongs-komponentti kun olet luonut sen */}
                    </>
                ) : (
                    <CenterWrapper>
                        {t('no_karaoke_songs_to_show')}
                    </CenterWrapper>
                )
            }
        </PageContentWrapper>
    )
}