import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Row, ButtonGroup, Modal } from 'react-bootstrap';
import Button from '../Buttons/Button';
import GoBackButton from '../Buttons/GoBackButton';
import Icon from '../Icon';
import PageContentWrapper from '../Site/PageContentWrapper';
import PageTitle from '../Site/PageTitle';
import * as Constants from '../../utils/Constants';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import CenterWrapper from '../Site/CenterWrapper';
import Bands from './Bands';
import { useState } from 'react';
import Counter from '../Site/Counter';
import Alert from '../Alert';
import { pushToFirebase, removeFromFirebaseById, updateToFirebaseById } from '../../datatier/datatier';
import AddBand from './AddBand';
import { useAuth } from '../../contexts/AuthContext';
import { SortMode } from '../SearchSortFilter/SortModes';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { useToggle } from '../useToggle';
import useFetch from '../useFetch';

export default function ManageMusicBands() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_MUSIC, { keyPrefix: Constants.TRANSLATION_MUSIC });

    //fetch data
    const { data: bands, setData: setBands,
        originalData: originalBands, counter, loading } = useFetch(Constants.DB_MUSIC_BANDS);

    //modal
    const { status: showAddBand, toggleStatus: toggleAddBand } = useToggle();

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //user
    const { currentUser } = useAuth();

    const deleteBand = async (id) => {
        removeFromFirebaseById(Constants.DB_MUSIC_BANDS, id);
    }

    const addBand = async (bandID, band) => {
        try {
            clearMessages();
            band["created"] = getCurrentDateAsJson();
            band["createdBy"] = currentUser.email;
            pushToFirebase(Constants.DB_MUSIC_BANDS, band);
            setMessage(t('save_success'));
            setShowMessage(true);
        } catch (ex) {
            setError(t('save_exception'));
            setShowError(true);
        }
    }

    function clearMessages() {
        setError('');
        setShowError(false);
        setMessage('');
        setShowMessage(false);
    }

    const editBand = (band) => {
        const id = band.id;
        updateToFirebaseById(Constants.DB_MUSIC_BANDS, id, band);
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <PageContentWrapper>

            <PageTitle title={t('music_bands_title')} />

            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Link to={Constants.NAVIGATION_MANAGE_MUSICLISTS} className='btn btn-primary'>
                        <Icon name={Constants.ICON_LIST_ALT} color='white' />
                        {t('button_music_lists')}
                    </Link>
                </ButtonGroup>
            </Row>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success'
                onClose={() => { setShowMessage(false); setShowError(false); }}
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
                    iconName={Constants.ICON_PLUS}
                    color={showAddBand ? Constants.COLOR_ADDBUTTON_OPEN : Constants.COLOR_ADDBUTTON_CLOSED}
                    text={showAddBand ? t('button_close') : t('button_add_music_band')}
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
