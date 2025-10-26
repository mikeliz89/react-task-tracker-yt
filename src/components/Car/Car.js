import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Alert from '../Alert';
import GoBackButton from '../Buttons/GoBackButton';
import Button from '../Buttons/Button';
import AddFueling from './AddFueling';
import { Tabs, Tab, Row, ButtonGroup, Modal } from 'react-bootstrap';
import AddMaintenance from './AddMaintenance';
import AddInfo from './AddInfo';
import CarFuelings from './CarFuelings';
import CarMaintenances from './CarMaintenances';
import PageTitle from '../Site/PageTitle';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { useAuth } from '../../contexts/AuthContext';
import CenterWrapper from '../Site/CenterWrapper';
import PageContentWrapper from '../Site/PageContentWrapper';
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION, VARIANTS } from '../../utils/Constants';
import { pushToFirebase, removeFromFirebaseById } from '../../datatier/datatier';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import { SortMode } from "../SearchSortFilter/SortModes";
import useFetch from '../Hooks/useFetch';
import Counter from '../Site/Counter';
import NavButton from '../Buttons/NavButton';
import { useAlert } from '../Hooks/useAlert';

export default function Car() {

    //translation
    const { t } = useTranslation([TRANSLATION.TRANSLATION], { keyPrefix: TRANSLATION.CAR });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //alert
    const {
        message, setMessage,
        showMessage, setShowMessage,
        error, setError,
        showError, setShowError,
        clearMessages
    } = useAlert();

    //modal
    const [showAddMaintenance, setShowAddMaintenance] = useState(false);
    const [showAddFueling, setShowAddFueling] = useState(false);
    const handleClose = () => {
        setShowAddFueling(false);
        setShowAddMaintenance(false);
    }

    //fetch data
    const { data: carFuelings, setData: setCarFuelings, originalData: originalCarFuelings, counter: fuelingsCounter, loading } = useFetch(DB.CAR_FUELING);
    const { data: carMaintenances, originalData: originalCarMaintenances, counter: maintenancesCounter } = useFetch(DB.CAR_MAINTENANCE);

    //user
    const { currentUser } = useAuth();

    const addFueling = (fueling) => {
        try {
            fueling["created"] = getCurrentDateAsJson();
            fueling["createdBy"] = currentUser.email;
            pushToFirebase(DB.CAR_FUELING, fueling);
            showSuccess();
        } catch (ex) {
            showFailure(ex);
        }

        function showFailure(ex) {
            setError(t('save_exception'));
            setShowError(true);
            console.warn(ex);
        }

        function showSuccess() {
            setMessage(t('save_successful'));
            setShowMessage(true);
        }
    }

    const deleteFueling = async (id) => {
        removeFromFirebaseById(DB.CAR_FUELING, id);
    }

    const addMaintenance = (maintenance) => {
        try {
            maintenance["created"] = getCurrentDateAsJson();
            maintenance["createdBy"] = currentUser.email;
            pushToFirebase(DB.CAR_MAINTENANCE, maintenance);
            showSuccess();
        } catch (ex) {
            showFailure(ex);
        }

        function showFailure(ex) {
            setError(t('save_exception'));
            setShowError(true);
            console.warn(ex);
        }

        function showSuccess() {
            setMessage(t('save_successful'));
            setShowMessage(true);
        }
    }

    const deleteMaintenance = async (id) => {
        removeFromFirebaseById(DB.CAR_MAINTENANCE, id);
    }

    return loading ? (
        <h3>{tCommon("loading")}</h3>
    ) : (
        <PageContentWrapper>

            <PageTitle title={t('car_title')} />

            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <NavButton to={NAVIGATION.MANAGE_CARLISTS}
                        icon={ICONS.LIST_ALT}
                    >
                        {tCommon('buttons.button_lists')}
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

            <Tabs defaultActiveKey="fuelings"
                id="car-Tabs"
                className="mb-3"
                style={{ marginTop: '10px' }}>

                <Tab eventKey="carInfo" title={t('add_info_title')}>
                    <AddInfo />
                </Tab>
                <Tab eventKey="fuelings" title={t('fuelings')}>

                    <Button
                        color={showAddFueling ? COLORS.ADDBUTTON_OPEN : COLORS.ADDBUTTON_CLOSED}
                        onClick={() => setShowAddFueling(!showAddFueling)}
                        text={showAddFueling ? tCommon('buttons.button_close') : t('add_fueling')}
                        secondIconName={ICONS.GAS_PUMP}
                        iconName={ICONS.PLUS} />
                    {

                        <Modal show={showAddFueling} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>{t('modal_header_add_fueling')}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <AddFueling
                                    onSave={addFueling}
                                    onClose={() => setShowAddFueling(false)} />
                            </Modal.Body>
                        </Modal>

                    }
                    {/* Fuelings Start */}
                    <>
                        {
                            originalCarFuelings != null && originalCarFuelings.length > 0 ? (
                                <SearchSortFilter
                                    onSet={setCarFuelings}
                                    //search
                                    originalList={originalCarFuelings}
                                    //sort
                                    defaultSort={SortMode.Created_DESC}
                                    showSortByCreatedDate={true}
                                />
                            ) : (<></>)
                        }
                        <Counter counter={fuelingsCounter} text={tCommon('amount')} list={carFuelings} originalList={originalCarFuelings} />
                        {
                            carFuelings != null && carFuelings.length > 0 ? (
                                <CarFuelings
                                    carFuelings={carFuelings} onDelete={deleteFueling} />
                            ) : (
                                <>
                                    <CenterWrapper>
                                        {t('no_car_fuelings')}
                                    </CenterWrapper>
                                </>
                            )
                        }
                    </>
                    {/* Fuelings End */}
                </Tab>
                <Tab eventKey="carMaintenances" title={t('car_maintenances')}>
                    <Button
                        color={showAddMaintenance ? COLORS.ADDBUTTON_OPEN : COLORS.ADDBUTTON_CLOSED}
                        onClick={() => setShowAddMaintenance(!showAddMaintenance)}
                        text={showAddFueling ? tCommon('buttons.button_close') : t('add_maintenance')}
                        iconName={ICONS.PLUS}
                        secondIconName={ICONS.WRENCH} />
                    {

                        <Modal show={showAddMaintenance} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>{t('modal_header_add_maintenance')}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <AddMaintenance
                                    onSave={addMaintenance}
                                    onClose={() => setShowAddMaintenance(false)} />
                            </Modal.Body>
                        </Modal>

                    }
                    {/* Maintenances Start */}

                    <>
                        <Counter counter={maintenancesCounter} text={tCommon('amount')} list={carMaintenances} originalList={originalCarMaintenances} />
                        {
                            carMaintenances != null && carMaintenances.length > 0 ? (
                                <CarMaintenances
                                    carMaintenances={carMaintenances} onDelete={deleteMaintenance} />
                            ) : (
                                <>
                                    <CenterWrapper>
                                        {t('no_car_maintenances')}
                                    </CenterWrapper>
                                </>
                            )
                        }
                    </>
                    {/* Maintenances End */}
                </Tab>
            </Tabs>

        </PageContentWrapper >
    )
}