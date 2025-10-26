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
import Records from './Records';
import { useState } from 'react';
import Counter from '../Site/Counter';
import Alert from '../Alert';
import { pushToFirebase, removeFromFirebaseById, updateToFirebaseById } from '../../datatier/datatier';
import AddRecord from './AddRecord';
import { useAuth } from '../../contexts/AuthContext';
import { SortMode } from '../SearchSortFilter/SortModes';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { useToggle } from '../Hooks/useToggle';
import useFetch from '../Hooks/useFetch';
import NavButton from '../Buttons/NavButton';
import { useAlert } from '../Hooks/useAlert';

export default function ManageMusicRecords() {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MUSIC });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //fetch data
    const { data: records, setData: setRecords,
        originalData: originalRecords, counter, loading } = useFetch(DB.MUSIC_RECORDS);

    //modal
    const { status: showAddRecord, toggleStatus: toggleAddRecord } = useToggle();

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

    const deleteRecord = async (id) => {
        removeFromFirebaseById(DB.MUSIC_RECORDS, id);
    }

    const addRecord = async (recordID, record) => {
        try {
            clearMessages();
            record["created"] = getCurrentDateAsJson();
            record["createdBy"] = currentUser.email;
            pushToFirebase(DB.MUSIC_RECORDS, record);
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

    const editRecord = (record) => {
        const id = record.id;
        updateToFirebaseById(DB.MUSIC_RECORDS, id, record);
    }

    return loading ? (
        <h3>{tCommon("loading")}</h3>
    ) : (
        <PageContentWrapper>

            <PageTitle title={t('music_records_title')} />

            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <NavButton to={NAVIGATION.MANAGE_MUSICLISTS}
                        icon={ICONS.LIST_ALT} >
                        {t('button_music_lists')}
                    </NavButton>
                </ButtonGroup>
            </Row>

            <Alert message={message}
                showMessage={showMessage}
                error={error} showError={showError}
                variant={VARIANTS.SUCCESS}
                onClose={clearMessages}
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
                    iconName={ICONS.PLUS}
                    color={showAddRecord ? COLORS.ADDBUTTON_OPEN : COLORS.ADDBUTTON_CLOSED}
                    text={showAddRecord ? tCommon('buttons.button_close') : t('button_add_music')}
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
