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
import Records from './Records';
import { useState } from 'react';
import Counter from '../Site/Counter';
import Alert from '../Alert';
import { pushToFirebase, removeFromFirebaseById, updateToFirebaseById } from '../../datatier/datatier';
import AddRecord from './AddRecord';
import { useAuth } from '../../contexts/AuthContext';
import { SortMode } from '../SearchSortFilter/SortModes';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { useToggle } from '../UseToggle';
import useFetch from '../UseFetch';

export default function ManageMusicRecords() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_MUSIC, { keyPrefix: Constants.TRANSLATION_MUSIC });

    //fetch data
    const { data: records, setData: setRecords,
        originalData: originalRecords, counter, loading } = useFetch(Constants.DB_MUSIC_RECORDS);

    //modal
    const { status: showAddRecord, toggleStatus: toggleAddRecord } = useToggle();

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //user
    const { currentUser } = useAuth();

    const deleteRecord = async (id) => {
        removeFromFirebaseById(Constants.DB_MUSIC_RECORDS, id);
    }

    const addRecord = async (recordID, record) => {
        try {
            clearMessages();
            record["created"] = getCurrentDateAsJson();
            record["createdBy"] = currentUser.email;
            pushToFirebase(Constants.DB_MUSIC_RECORDS, record);
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

    const editRecord = (record) => {
        const id = record.id;
        updateToFirebaseById(Constants.DB_MUSIC_RECORDS, id, record);
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
                    <AddRecord onSave={addRecord} onClose={toggleAddRecord} />
                </Modal.Body>
            </Modal>

            {
                originalRecords != null && originalRecords.length > 0 ? (
                    <SearchSortFilter
                        onSet={setRecords}
                        originalList={originalRecords}
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
                records != null && records.length > 0 ? (
                    <>
                        <Counter list={records} originalList={originalRecords} counter={counter} />
                        <Records records={records} onDelete={deleteRecord} onEdit={editRecord} />
                    </>
                ) : (
                    <>
                        <CenterWrapper>
                            {t('no_records_to_show')}
                        </CenterWrapper>
                    </>
                )
            }

        </PageContentWrapper>
    )
}
