//react
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
//buttons
import GoBackButton from '../GoBackButton';
import Button from '../Button';
//car
import AddFueling from './AddFueling';
import AddInfo from './AddInfo';
import CarFuelings from './CarFuelings';
//firebase
import { db } from '../../firebase-config';
import { onValue, ref } from 'firebase/database';
import PageTitle from '../PageTitle';

export default function Car() {
    
    //constants
    const DB_FUELING = 'car-fueling';

    //states
    const [loading, setLoading] = useState(true);
    const [showAddFueling, setShowAddFueling] = useState(false);
    const [showAddInfo, setShowAddInfo] = useState(false);
    const [carFuelings, setCarFuelings] = useState({});

    //translation
    const { t } = useTranslation('car', { keyPrefix: 'car' });

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

    return loading ? (
        <h3>{t('loading')}</h3>
      ) : (
        <div>
            <GoBackButton />
            <PageTitle title={t('car_title')} />
            <Button onClick={() => setShowAddInfo(!showAddInfo)}
                text={t('add_info')} />
            <Button onClick={() => setShowAddFueling(!showAddFueling)}
                text={t('add_fueling')} />
            {/* Info Start */}
            {
                showAddInfo ?
                    (<div>
                        <AddInfo />
                    </div>
                    ) : ''
            }
            {/* Info End */}
            {/* Fueling Start */}
            {
                showAddFueling ?
                    (<div>
                        <AddFueling />
                    </div>
                    ) : ''
            }
            {/* Fueling End */}
            <div>
                {
                    carFuelings != null && carFuelings.length > 0 ? (
                        <CarFuelings carFuelings={carFuelings} />
                    ) : (
                        t('no_car_fuelings')
                    )
                }
            </div>
        </div>
    )
}
