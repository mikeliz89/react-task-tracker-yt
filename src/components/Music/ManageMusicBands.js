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
import Bands from './Bands';
import Counter from '../Site/Counter';
import Alert from '../Alert';
import { pushToFirebase, removeFromFirebaseById, updateToFirebaseById } from '../../datatier/datatier';
import AddBand from './AddBand';
import { useAuth } from '../../contexts/AuthContext';
import { SortMode } from '../SearchSortFilter/SortModes';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { useToggle } from '../Hooks/useToggle';
import useFetch from '../Hooks/useFetch';
import NavButton from '../Buttons/NavButton';
import { useAlert } from '../Hooks/useAlert';

export default function ManageMusicBands() {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MUSIC });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //fetch data
    const { data: bands, setData: setBands,
        originalData: originalBands, counter, loading } = useFetch(DB.MUSIC_BANDS);

    //modal
    const { status: showAddBand, toggleStatus: toggleAddBand } = useToggle();

    //alert
    const {
        message, setMessage,
        showMessage, setShowMessage,
        error, setError,
        showError, setShowError,
        clearMessages
    } = useAlert();

    //user
    const { currentUser } = useAuth();

    const deleteBand = async (id) => {
        removeFromFirebaseById(DB.MUSIC_BANDS, id);
    }

    const addBand = async (bandID, band) => {
        try {
            clearMessages();
            band["created"] = getCurrentDateAsJson();
            band["createdBy"] = currentUser.email;
            pushToFirebase(DB.MUSIC_BANDS, band);
            showSuccess();
        } catch (ex) {
            showFailure();
        }

        function showFailure() {
            setError(t('save_exception'));
            setShowError(true);
        }

        function showSuccess() {
            setMessage(t('save_success'));
            setShowMessage(true);
        }
    }

    const editBand = (band) => {
        const id = band.id;
        updateToFirebaseById(DB.MUSIC_BANDS, id, band);
    }

    return loading ? (
        <h3>{tCommon("loading")}</h3>
    ) : (
        <PageContentWrapper>

            <PageTitle title={t('music_bands_title')} />

            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <NavButton to={NAVIGATION.MANAGE_MUSICLISTS}
                        icon={ICONS.LIST_ALT}>
                        {t('button_music_lists')}
                    </NavButton>
                </ButtonGroup>
            </Row>

            <Alert message={message}
                showMessage={showMessage}
                error={error}
                showError={showError}
                variant={VARIANTS.SUCCESS}
                onClose={clearMessages}
            />

            <Modal show={showAddBand} onHide={toggleAddBand}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modal_header_add_band')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddBand onSave={addBand} onClose={toggleAddBand} />
                </Modal.Body>
            </Modal>

            {
                originalBands != null && originalBands.length > 0 ? (
                    <SearchSortFilter
                        onSet={setBands}
                        originalList={originalBands}
                        //search
                        showSearchByText={true}
                        showSearchByDescription={true}
                        //sort
                        defaultSort={SortMode.Name_ASC}
                        showSortByName={true}
                        showSortByStarRating={true}
                        showSortByCreatedDate={true}
                        //filter
                        filterMode={FilterMode.Name}
                        showFilterSeenLive={true}
                        showFilterNotHaveSeenLive={true}
                    />
                ) : (<></>)
            }

            <CenterWrapper>
                <Button
                    iconName={ICONS.PLUS}
                    color={showAddBand ? COLORS.ADDBUTTON_OPEN : COLORS.ADDBUTTON_CLOSED}
                    text={showAddBand ? tCommon('buttons.button_close') : t('button_add_music_band')}
                    onClick={toggleAddBand} />
            </CenterWrapper>

            {
                bands != null && bands.length > 0 ? (
                    <>
                        <Counter list={bands} originalList={originalBands} counter={counter} />
                        <Bands bands={bands} onDelete={deleteBand} onEdit={editBand} />
                    </>
                ) : (
                    <>
                        <CenterWrapper>
                            {t('no_bands_to_show')}
                        </CenterWrapper>
                    </>
                )
            }

        </PageContentWrapper>
    )
}
