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
import * as Constants from '../../utils/Constants';
import { pushToFirebase, removeFromFirebaseById } from '../../datatier/datatier';
import Icon from '../Icon';
import { Link } from 'react-router-dom';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import { SortMode } from "../SearchSortFilter/SortModes";
import useFetch from '../useFetch';
import Counter from '../Site/Counter';

export default function Car() {

    //translation
    const { t } = useTranslation([Constants.TRANSLATION], { keyPrefix: Constants.TRANSLATION_CAR });
    const { t: tCommon } = useTranslation(Constants.TRANSLATION_COMMON, {keyPrefix: Constants.TRANSLATION_COMMON});

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //modal
    const [showAddMaintenance, setShowAddMaintenance] = useState(false);
    const [showAddFueling, setShowAddFueling] = useState(false);
    const handleClose = () => {
        setShowAddFueling(false);
        setShowAddMaintenance(false);
    }

    //fetch data
    const { data: carFuelings, setData: setCarFuelings, originalData: originalCarFuelings, counter: fuelingsCounter, loading } = useFetch(Constants.DB_CAR_FUELING);
    const { data: carMaintenances, originalData: originalCarMaintenances, counter: maintenancesCounter } = useFetch(Constants.DB_CAR_MAINTENANCE);

    //user
    const { currentUser } = useAuth();

    const addFueling = (fueling) => {
        try {
            fueling["created"] = getCurrentDateAsJson();
            fueling["createdBy"] = currentUser.email;
            pushToFirebase(Constants.DB_CAR_FUELING, fueling);
            setMessage(t('save_successful'));
            setShowMessage(true);
        } catch (ex) {
            setError(t('save_exception'));
            setShowError(true);
            console.warn(ex);
        }
    }

    const deleteFueling = async (id) => {
        removeFromFirebaseById(Constants.DB_CAR_FUELING, id);
    }

    const addMaintenance = (maintenance) => {
        try {
            maintenance["created"] = getCurrentDateAsJson();
            maintenance["createdBy"] = currentUser.email;
            pushToFirebase(Constants.DB_CAR_MAINTENANCE, maintenance);
            setMessage(t('save_successful'));
            setShowMessage(true);
        } catch (ex) {
            setError(t('save_exception'));
            setShowError(true);
            console.warn(ex);
        }
    }

    const deleteMaintenance = async (id) => {
        removeFromFirebaseById(Constants.DB_CAR_MAINTENANCE, id);
    }

    return loading ? (
        <h3>{tCommon("loading")}</h3>
    ) : (
        <PageContentWrapper>

            <PageTitle title={t('car_title')} />

            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Link to={Constants.NAVIGATION_MANAGE_CARLISTS} className='btn btn-primary'>
                        <Icon name={Constants.ICON_LIST_ALT} color={Constants.COLOR_WHITE} />
                        {t('button_car_lists')}
                    </Link>
                </ButtonGroup>
            </Row>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant={Constants.VARIANT_SUCCESS} onClose={() => { setShowMessage(false); setShowError(false); }}
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
                        color={showAddFueling ? Constants.COLOR_ADDBUTTON_OPEN : Constants.COLOR_ADDBUTTON_CLOSED}
                        onClick={() => setShowAddFueling(!showAddFueling)}
                        text={showAddFueling ? tCommon('buttons.button_close') : t('add_fueling')}
                        secondIconName={Constants.ICON_GAS_PUMP}
                        iconName={Constants.ICON_PLUS} />
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
                        <Counter counter={fuelingsCounter} text={t('amount')} list={carFuelings} originalList={originalCarFuelings} />
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
                        color={showAddMaintenance ? Constants.COLOR_ADDBUTTON_OPEN : Constants.COLOR_ADDBUTTON_CLOSED}
                        onClick={() => setShowAddMaintenance(!showAddMaintenance)}
                        text={showAddFueling ? tCommon('buttons.button_close') : t('add_maintenance')}
                        iconName={Constants.ICON_PLUS}
                        secondIconName={Constants.ICON_WRENCH} />
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
                        <Counter counter={maintenancesCounter} text={t('amount')} list={carMaintenances} originalList={originalCarMaintenances} />
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