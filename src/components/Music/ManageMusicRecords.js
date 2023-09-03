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
import Musics from './Musics';
import { useState } from 'react';
import Counter from '../Site/Counter';
import Alert from '../Alert';
import { pushToFirebase, removeFromFirebaseById, updateToFirebaseById } from '../../datatier/datatier';
import AddMusic from './AddMusic';
import { useAuth } from '../../contexts/AuthContext';
import { SortMode } from '../SearchSortFilter/SortModes';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { useToggle } from '../UseToggle';
import useFetch from '../UseFetch';

export default function ManageMusicRecords() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_MUSIC, { keyPrefix: Constants.TRANSLATION_MUSIC });

    //fetch data
    const { data: musics, setData: setMusics,
        originalData: originalMusics, counter, loading } = useFetch(Constants.DB_MUSIC);

    //modal
    const { status: showAddRecord, toggleStatus: toggleAddRecord } = useToggle();

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //user
    const { currentUser } = useAuth();

    const deleteMusic = async (id) => {
        removeFromFirebaseById(Constants.DB_MUSIC, id);
    }

    const addMusic = async (musicID, music) => {
        try {
            clearMessages();
            music["created"] = getCurrentDateAsJson();
            music["createdBy"] = currentUser.email;
            pushToFirebase(Constants.DB_MUSIC, music);
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

    const editMusic = (music) => {
        const id = music.id;
        updateToFirebaseById(Constants.DB_MUSIC, id, music);
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <PageContentWrapper>

            <PageTitle title={t('music_records_title')} />

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

            <Modal show={showAddRecord} onHide={toggleAddRecord}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modal_header_add_record')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddMusic onSave={addMusic} onClose={toggleAddRecord} />
                </Modal.Body>
            </Modal>

            {
                originalMusics != null && originalMusics.length > 0 ? (
                    <SearchSortFilter
                        onSet={setMusics}
                        originalList={originalMusics}
                        //search
                        showSearchByText={true}
                        showSearchByDescription={true}
                        //sort
                        defaultSort={SortMode.Name_ASC}
                        showSortByName={true}
                        showSortByStarRating={true}
                        showSortByCreatedDate={true}
                        showSortByPublishYear={true}
                        //filter
                        filterMode={FilterMode.Name}
                        showFilterHaveAtHome={true}
                        showFilterNotHaveAtHome={true}
                    />
                ) : (<></>)
            }

            <CenterWrapper>
                <Button
                    iconName={Constants.ICON_PLUS}
                    color={showAddRecord ? Constants.COLOR_ADDBUTTON_OPEN : Constants.COLOR_ADDBUTTON_CLOSED}
                    text={showAddRecord ? t('button_close') : t('button_add_music')}
                    onClick={toggleAddRecord} />
            </CenterWrapper>

            {
                musics != null && musics.length > 0 ? (
                    <>
                        <Counter list={musics} originalList={originalMusics} counter={counter} />
                        <Musics musics={musics} onDelete={deleteMusic} onEdit={editMusic} />
                    </>
                ) : (
                    <>
                        <CenterWrapper>
                            {t('no_musics_to_show')}
                        </CenterWrapper>
                    </>
                )
            }

        </PageContentWrapper>
    )
}
