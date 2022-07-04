//react
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
//buttons
import GoBackButton from '../GoBackButton';
import Button from '../Button';
//car
import AddFueling from './AddFueling';
import CarFuelings from './CarFuelings';
//firebase
import { db } from '../../firebase-config';
import { onValue, ref } from 'firebase/database';

export default function Car() {

    //states
    const [showAddFueling, setShowAddFueling] = useState();
    const [carFuelings, setCarFuelings] = useState({});

    //translation
    const { t } = useTranslation('car', { keyPrefix: 'car' });

    //load data
    useEffect(() => {
        const getFuelings = async () => {
            await fetchCarFuelingsFromFirebase();
        }
        getFuelings()
    }, [])


    const DB_FUELING = 'car-fueling';

    const fetchCarFuelingsFromFirebase = async () => {
        const dbref = await ref(db, `${DB_FUELING}`);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            for (let id in snap) {
                fromDB.push({ id, ...snap[id] });
            }
            setCarFuelings(fromDB);
        })
    }

    return (
        <div>
            <GoBackButton />
            <h3 className="page-title">{t('car_title')}</h3>
            <Button onClick={() => setShowAddFueling(!showAddFueling)}
                text={t('add_fueling')} />
            <div>
                {
                    showAddFueling &&
                    <AddFueling />
                }
            </div>
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
