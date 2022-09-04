//react
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
//alert
import Alert from '../Alert';
//buttons
import GoBackButton from '../GoBackButton';
import Button from '../Button';
//car
import AddFueling from './AddFueling';
import AddInfo from './AddInfo';
import CarFuelings from './CarFuelings';
//firebase
import { db } from '../../firebase-config';
import { onValue, ref, push, remove } from 'firebase/database';
//pagetitle
import PageTitle from '../PageTitle';
//utils
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
//auth
import { useAuth } from '../../contexts/AuthContext';
import CenterWrapper from '../CenterWrapper';

export default function Car() {

    //constants
    const DB_FUELING = 'car-fueling';

    //translation
    const { t } = useTranslation('car', { keyPrefix: 'car' });

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //states
    const [loading, setLoading] = useState(true);
    const [showAddFueling, setShowAddFueling] = useState(false);
    const [showAddInfo, setShowAddInfo] = useState(false);
    const [carFuelings, setCarFuelings] = useState({});

    //user
    const { currentUser } = useAuth();

    //load data
    useEffect(() => {
        const getFuelings = async () => {
            await fetchCarFuelingsFromFirebase();
        }
        getFuelings();
    }, []);

    const fetchCarFuelingsFromFirebase = async () => {
        const dbref = await ref(db, `${DB_FUELING}`);
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

    const addFueling = (fueling) => {
        try {
            fueling["created"] = getCurrentDateAsJson();
            fueling["createdBy"] = currentUser.email;
            const dbref = ref(db, DB_FUELING);
            push(dbref, fueling);
            setMessage(t('save_successful'));
            setShowMessage(true);
        } catch (ex) {
            setError(t('save_exception'));
            setShowError(true);
            console.warn(ex);
        }
    }

    const deleteFueling = async (id) => {
        const dbref = ref(db, `${DB_FUELING}/${id}`);
        remove(dbref)
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <div>
            <GoBackButton />
            <PageTitle title={t('car_title')} />

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

            <Button
                color={showAddInfo ? 'red' : 'steelblue'}
                onClick={() => setShowAddInfo(!showAddInfo)}
                text={showAddInfo ? t('button_close') : t('add_info')}
                iconName={'car'} />
            <Button
                color={showAddFueling ? 'red' : 'steelblue'}
                onClick={() => setShowAddFueling(!showAddFueling)}
                text={showAddFueling ? t('button_close') : t('add_fueling')}
                iconName={'gas-pump'} />
            {/* Info Start */}
            {
                showAddInfo ?
                    (<div>
                        <AddInfo onClose={() => setShowAddInfo(false)} />
                    </div>
                    ) : ''
            }
            {/* Info End */}
            {/* Fueling Start */}
            {
                showAddFueling ?
                    (<div>
                        <AddFueling
                            onSave={addFueling}
                            onClose={() => setShowAddFueling(false)} />
                    </div>
                    ) : ''
            }
            {/* Fueling End */}
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
        </div>
    )
}
