import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Modal } from 'react-bootstrap';
import { useState } from 'react';
import Button from '../Buttons/Button';
import GoBackButton from '../Buttons/GoBackButton';
import AddGear from './AddGear';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import * as Constants from "../../utils/Constants";
import { useAuth } from '../../contexts/AuthContext';
import Gears from './Gears';
import PageTitle from '../Site/PageTitle';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import { SortMode } from '../SearchSortFilter/SortModes';
import Alert from '../Alert';
import PageContentWrapper from '../Site/PageContentWrapper';
import CenterWrapper from '../Site/CenterWrapper';
import Counter from '../Site/Counter';
import { pushToFirebase, removeFromFirebaseById } from '../../datatier/datatier';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { useToggle } from '../UseToggle';
import useFetch from '../useFetch';

export default function ManageGear() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_BACKPACKING, { keyPrefix: Constants.TRANSLATION_BACKPACKING });

    //fetch data
    const { data: gear, setData: setGear,
        originalData: originalGear, counter, loading } = useFetch(Constants.DB_BACKPACKING_GEAR);

    //modal
    const { status: showAddGear, toggleStatus: toggleAddGear } = useToggle();

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //user
    const { currentUser } = useAuth();

    const addGear = async (gear) => {
        try {
            clearMessages();
            gear["created"] = getCurrentDateAsJson();
            gear["createdBy"] = currentUser.email;
            pushToFirebase(Constants.DB_BACKPACKING_GEAR, gear);
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

    const deleteGear = (id) => {
        removeFromFirebaseById(Constants.DB_BACKPACKING_GEAR, id);
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <PageContentWrapper>

            <PageTitle title={t('my_gear_title')} />

            <Row>
                <ButtonGroup>
                    <GoBackButton />
                </ButtonGroup>
            </Row>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => { setShowMessage(false); setShowError(false); }}
            />

            <Modal show={showAddGear} onHide={toggleAddGear}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modal_header_add_gear')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddGear onSave={addGear} onClose={toggleAddGear} />
                </Modal.Body>
            </Modal>

            {
                originalGear != null && originalGear.length > 0 ? (
                    <SearchSortFilter
                        onSet={setGear}
                        //search
                        showSearchByText={true}
                        originalList={originalGear}
                        //sort
                        defaultSort={SortMode.Name_ASC}
                        showSortByName={true}
                        showSortByStarRating={true}
                        //filter
                        filterMode={FilterMode.Name}
                    />
                ) : (<></>)
            }

            <CenterWrapper>
                <Button
                    iconName={Constants.ICON_PLUS}
                    color={showAddGear ? Constants.COLOR_ADDBUTTON_OPEN : Constants.COLOR_ADDBUTTON_CLOSED}
                    text={showAddGear ? t('button_close') : t('button_add_gear')}
                    onClick={toggleAddGear} />
            </CenterWrapper>

            {
                gear != null && gear.length > 0 ? (
                    <>
                        <Counter list={gear} originalList={originalGear} counter={counter} />
                        <Gears gears={gear}
                            onDelete={deleteGear} />
                    </>
                ) : (
                    <>
                        <CenterWrapper>
                            {t('no_gear_to_show')}
                        </CenterWrapper>
                    </>
                )
            }
        </PageContentWrapper>
    )
}
