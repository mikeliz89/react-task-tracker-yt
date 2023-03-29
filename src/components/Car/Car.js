import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import Alert from '../Alert';
import GoBackButton from '../Buttons/GoBackButton';
import Button from '../Buttons/Button';
import AddFueling from './AddFueling';
import { Accordion, Table, Row, ButtonGroup, Col, Tabs, Tab } from 'react-bootstrap';
import AddMaintenance from './AddMaintenance';
import AddInfo from './AddInfo';
import CarFuelings from './CarFuelings';
import CarMaintenances from './CarMaintenances';
import { db } from '../../firebase-config';
import { onValue, ref } from 'firebase/database';
import PageTitle from '../Site/PageTitle';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { useAuth } from '../../contexts/AuthContext';
import CenterWrapper from '../Site/CenterWrapper';
import PageContentWrapper from '../Site/PageContentWrapper';
import * as Constants from '../../utils/Constants';
import { pushToFirebase, removeFromFirebaseById } from '../../datatier/datatier';

export default function Car() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_CAR, { keyPrefix: Constants.TRANSLATION_CAR });

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //states
    const [loading, setLoading] = useState(true);
    const [showAddFueling, setShowAddFueling] = useState(false);
    const [showAddMaintenance, setShowAddMaintenance] = useState(false);
    const [showAddInfo, setShowAddInfo] = useState(false);
    const [carFuelings, setCarFuelings] = useState({});
    const [carMaintenances, setCarMaintenances] = useState({});

    //user
    const { currentUser } = useAuth();

    //load data
    useEffect(() => {
        const getFuelings = async () => {
            await fetchCarFuelingsFromFirebase();
        }
        getFuelings();
        const getMaintenances = async () => {
            await fetchCarMaintenancesFromFirebase();
        }
        getMaintenances();
    }, []);

    const fetchCarFuelingsFromFirebase = async () => {
        const dbref = await ref(db, `${Constants.DB_CAR_FUELING}`);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            for (let id in snap) {
                fromDB.push({ id, ...snap[id] });
            }
            setLoading(false);
            setCarFuelings(fromDB);
        })
    }
    const fetchCarMaintenancesFromFirebase = async () => {
        const dbref = await ref(db, `${Constants.DB_CAR_MAINTENANCE}`);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            for (let id in snap) {
                fromDB.push({ id, ...snap[id] });
            }
            setLoading(false);
            setCarMaintenances(fromDB);
        })
    }

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
        <h3>{t('loading')}</h3>
    ) : (
        <PageContentWrapper>
            <GoBackButton />
            <PageTitle title={t('car_title')} />

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

            <Tabs defaultActiveKey="fuelings"
                id="car-Tabs"
                className="mb-3">

                <Tab eventKey="carInfo" title={t('add_info_title')}>
                    <Button
                        color={showAddInfo ? 'red' : 'steelblue'}
                        onClick={() => setShowAddInfo(!showAddInfo)}
                        text={showAddInfo ? t('button_close') : t('add_info')}
                        iconName={Constants.ICON_CAR} />
                    {/* Info Start */}
                    {
                        showAddInfo ?
                            (<div>
                                <AddInfo onClose={() => setShowAddInfo(false)} />
                            </div>
                            ) : ''
                    }
                    {/* Info End */}
                </Tab>
                <Tab eventKey="fuelings" title={t('fuelings')}>
                    <Button
                        color={showAddFueling ? 'red' : 'steelblue'}
                        onClick={() => setShowAddFueling(!showAddFueling)}
                        text={showAddFueling ? t('button_close') : t('add_fueling')}
                        iconName={Constants.ICON_GAS_PUMP} />
                    {
                        showAddFueling ?
                            (<div>
                                <AddFueling
                                    onSave={addFueling}
                                    onClose={() => setShowAddFueling(false)} />
                            </div>
                            ) : ''
                    }
                    {/* Fuelings Start */}
                    <div>
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
                    </div>
                    {/* Fuelings End */}
                </Tab>
                <Tab eventKey="carMaintenances" title={t('car_maintenances')}>
                    <Button
                        color={showAddMaintenance ? 'red' : 'steelblue'}
                        onClick={() => setShowAddMaintenance(!showAddMaintenance)}
                        text={showAddFueling ? t('button_close') : t('add_maintenance')}
                        iconName={Constants.ICON_WRENCH} />
                    {
                        showAddMaintenance ?
                            (<div>
                                <AddMaintenance
                                    onSave={addMaintenance}
                                    onClose={() => setShowAddMaintenance(false)} />
                            </div>
                            ) : ''
                    }
                    {/* Maintenances Start */}

                    <div>
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
                    </div>
                    {/* Maintenances End */}
                </Tab>
            </Tabs>
        </PageContentWrapper>
    )
}
