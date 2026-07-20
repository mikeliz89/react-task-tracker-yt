import { useEffect, useMemo, useState } from 'react';
import { ButtonGroup, Modal, Row, Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebase, removeFromFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION, VARIANTS } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import Alert from '../Alert';
import Button from '../Buttons/Button';
import GoBackButton from '../Buttons/GoBackButton';
import NavButton from '../Buttons/NavButton';
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import { SortMode } from '../SearchSortFilter/SortModes';
import CenterWrapper from '../Site/CenterWrapper';
import Counter from '../Site/Counter';
import PageContentWrapper from '../Site/PageContentWrapper';
import PageTitle from '../Site/PageTitle';

import AddFueling from './AddFueling';
import AddInfo from './AddInfo';
import AddMaintenance from './AddMaintenance';
import CarFuelings from './CarFuelings';
import CarMaintenances from './CarMaintenances';
import Icon from '../Icon';

export default function CarDetails() {

    //translation
    const { t } = useTranslation([TRANSLATION.TRANSLATION], { keyPrefix: TRANSLATION.CAR });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //alert
    const {
        message, setMessage,
        showMessage, setShowMessage,
        error, setError,
        showError, setShowError,
        clearMessages,
        showSuccess,
        showFailure
    } = useAlert();

    //modal
    const [showAddMaintenance, setShowAddMaintenance] = useState(false);
    const [showAddFueling, setShowAddFueling] = useState(false);
    const handleClose = () => {
        setShowAddFueling(false);
        setShowAddMaintenance(false);
    }

    //fetch data
    const { id } = useParams();
    const selectedCarId = id ? decodeURIComponent(id) : '';
    const carFuelingsPath = `${DB.CAR_FUELING}/${selectedCarId}`;
    const carMaintenancesPath = `${DB.CAR_MAINTENANCE}/${selectedCarId}`;

    const { data: originalCarFuelings, loading } = useFetch(carFuelingsPath);
    const { data: originalCarMaintenances } = useFetch(carMaintenancesPath);
    const { data: cars, loading: loadingCars } = useFetch(DB.CARS);

    //user
    const { currentUser } = useAuth();

    const filteredOriginalCarFuelings = useMemo(() => (
        Array.isArray(originalCarFuelings) ? originalCarFuelings : []
    ), [originalCarFuelings]);

    const [carFuelings, setCarFuelings] = useState(filteredOriginalCarFuelings);

    useEffect(() => {
        if (filteredOriginalCarFuelings.length === 0) {
            setCarFuelings([]);
        }
    }, [filteredOriginalCarFuelings.length]);

    const filteredCarMaintenances = useMemo(() => (
        Array.isArray(originalCarMaintenances) ? originalCarMaintenances : []
    ), [originalCarMaintenances]);

    const selectedCar = useMemo(() => (
        Array.isArray(cars)
            ? cars.find((x) => x.id === selectedCarId)
            : null
    ), [cars, selectedCarId]);

    const selectedCarLabel = useMemo(() => {
        if (!selectedCar || Array.isArray(selectedCar)) {
            return '';
        }

        const brand = selectedCar.brand || '';
        const modelName = selectedCar.modelName || '';
        return `${brand} ${modelName}`.trim();
    }, [selectedCar]);

    const addFueling = (fueling) => {
        if (!selectedCarId) {
            showFailure(t('save_exception'));
            return;
        }

        try {
            fueling["created"] = getCurrentDateAsJson();
            fueling["createdBy"] = currentUser.email;
            pushToFirebase(carFuelingsPath, fueling);
            showSuccess(t('save_successful'));
        } catch (ex) {
            showFailure(t('save_exception'));
            console.warn(ex);
        }
    }

    const deleteFueling = async (id) => {
        removeFromFirebaseById(carFuelingsPath, id);
    }

    const addMaintenance = (maintenance) => {
        if (!selectedCarId) {
            showFailure(t('save_exception'));
            return;
        }

        try {
            maintenance["created"] = getCurrentDateAsJson();
            maintenance["createdBy"] = currentUser.email;
            pushToFirebase(carMaintenancesPath, maintenance);
            showSuccess(t('save_successful'));
        } catch (ex) {
            showFailure(t('save_exception'));
            console.warn(ex);
        }
    }

    const deleteMaintenance = async (id) => {
        removeFromFirebaseById(carMaintenancesPath, id);
    }

    return loading || loadingCars ? (
        <h3>{tCommon("loading")}</h3>
    ) : (
        <PageContentWrapper>

            <PageTitle title={selectedCarLabel || t('car_title')} iconName={ICONS.CAR} />

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

            {!selectedCar || Array.isArray(selectedCar) ? (
                <CenterWrapper>
                    {t('vehicle_not_found')}
                </CenterWrapper>
            ) : (
                <>
            <Alert
                message={message}
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

                <Tab eventKey="carInfo" title={<><Icon name={ICONS.INFO} style={{ marginRight: 6 }} />{t('add_info_title')}</>}>
                    <AddInfo carId={selectedCarId} />
                </Tab>
                <Tab eventKey="fuelings" title={<><Icon name={ICONS.GAS_PUMP} style={{ marginRight: 6 }} />{t('fuelings')}</>}>

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
                                    carId={selectedCarId}
                                    onSave={addFueling}
                                    onClose={() => setShowAddFueling(false)} />
                            </Modal.Body>
                        </Modal>

                    }
                    {/* Fuelings Start */}
                    <>
                        {
                            filteredOriginalCarFuelings != null && filteredOriginalCarFuelings.length > 0 ? (
                                <SearchSortFilter
                                    onSet={setCarFuelings}
                                    //search
                                    originalList={filteredOriginalCarFuelings}
                                    //sort
                                    defaultSort={SortMode.FuelingDate_DESC}
                                    showSortByCreatedDate={true}
                                    showSortByFuelingDate={true}
                                />
                            ) : (<></>)
                        }
                        <Counter counter={filteredOriginalCarFuelings.length} text={tCommon('amount')} list={carFuelings} originalList={filteredOriginalCarFuelings} />
                        {
                            carFuelings != null && carFuelings.length > 0 ? (
                                <CarFuelings
                                    carId={selectedCarId}
                                    items={carFuelings}
                                    chartFuelings={filteredOriginalCarFuelings}
                                    onDelete={deleteFueling} />
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
                <Tab eventKey="carMaintenances" title={<><Icon name={ICONS.WRENCH} style={{ marginRight: 6 }} />{t('car_maintenances')}</>}>
                    <Button
                        color={showAddMaintenance ? COLORS.ADDBUTTON_OPEN : COLORS.ADDBUTTON_CLOSED}
                        onClick={() => setShowAddMaintenance(!showAddMaintenance)}
                        text={showAddMaintenance ? tCommon('buttons.button_close') : t('add_maintenance')}
                        iconName={ICONS.PLUS}
                        secondIconName={ICONS.WRENCH} />
                    {

                        <Modal show={showAddMaintenance} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>{t('modal_header_add_maintenance')}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <AddMaintenance
                                    carId={selectedCarId}
                                    onSave={addMaintenance}
                                    onClose={() => setShowAddMaintenance(false)} />
                            </Modal.Body>
                        </Modal>

                    }
                    {/* Maintenances Start */}

                    <>
                        <Counter counter={filteredCarMaintenances.length} text={tCommon('amount')} list={filteredCarMaintenances} originalList={filteredCarMaintenances} />
                        {
                            filteredCarMaintenances != null && filteredCarMaintenances.length > 0 ? (
                                <CarMaintenances
                                    carId={selectedCarId}
                                    carMaintenances={filteredCarMaintenances} onDelete={deleteMaintenance} />
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
                </>
            )}

        </PageContentWrapper >
    )
}


