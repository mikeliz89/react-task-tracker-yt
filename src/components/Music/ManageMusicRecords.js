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
import { useState, useEffect } from 'react';
import Counter from '../Site/Counter';
import Alert from '../Alert';
import { pushToFirebase, removeFromFirebaseById, updateToFirebaseById } from '../../datatier/datatier';
import AddMusic from './AddMusic';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase-config';
import { ref, onValue } from 'firebase/database';
import { SortMode } from '../SearchSortFilter/SortModes';
import { FilterMode } from '../SearchSortFilter/FilterModes';

export default function ManageMusicRecords() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_MUSIC, { keyPrefix: Constants.TRANSLATION_MUSIC });

    //states
    const [loading, setLoading] = useState(true);
    const [counter, setCounter] = useState(0);
    const [musics, setMusics] = useState();
    const [originalMusics, setOriginalMusics] = useState();
    
    //modal
    const [showAdd, setShowAdd] = useState(false);
    const handleClose = () => setShowAdd(false);
    const handleShow = () => setShowAdd(true);

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //user
    const { currentUser } = useAuth();

    //load data
    useEffect(() => {
        let cancel = false;

        const getMusics = async () => {
            if (cancel) {
                return;
            }
            await fetchMusicsFromFirebase();
        }
        getMusics();

        return () => {
            cancel = true;
        }
    }, [])

    const fetchMusicsFromFirebase = async () => {
        const dbref = await ref(db, Constants.DB_MUSIC);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            let counterTemp = 0;
            for (let id in snap) {
                counterTemp++;
                fromDB.push({ id, ...snap[id] });
            }
            setCounter(counterTemp);
            setLoading(false);
            setMusics(fromDB);
            setOriginalMusics(fromDB);
        })
    }

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

            <Modal show={showAdd} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modal_header_add_record')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddMusic onSave={addMusic} onClose={() => setShowAdd(false)} />
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
                    color={showAdd ? Constants.COLOR_ADDBUTTON_OPEN: Constants.COLOR_ADDBUTTON_CLOSED}
                    text={showAdd ? t('button_close') : t('button_add_music')}
                    onClick={() => setShowAdd(!showAdd)} />
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
