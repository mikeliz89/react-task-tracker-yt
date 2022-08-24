//buttons
import GoBackButton from '../GoBackButton';
//react
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react'
//firebase
import { db } from '../../firebase-config';
import { ref, onValue, remove } from "firebase/database";
//utils
import { getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
//i18n
import i18n from "i18next";
//auth
import { useAuth } from '../../contexts/AuthContext';
//bmicalculator
import WeightChart from './WeightChart';
//pagetitle
import PageTitle from '../PageTitle';
//icon
import Icon from '../Icon';

const WeightHistory = () => {

    //constants
    const DB_WEIGHT_HISTORY = '/weighthistory';

    //translation
    const { t } = useTranslation('bmicalculator', { keyPrefix: 'bmicalculator' });

    //auth
    const { currentUser } = useAuth();

    //states
    const [historyRows, setHistoryRows] = useState()

    //load data
    useEffect(() => {
        let cancel = false;

        const getHistoryRows = async () => {
            if (cancel) {
                return;
            }
            await fetchHistoryRowsFromFirebase()
        }
        getHistoryRows()

        return () => {
            cancel = true;
        }
    }, [])

    const fetchHistoryRowsFromFirebase = async () => {
        const dbref = await ref(db, `${DB_WEIGHT_HISTORY}/${currentUser.uid}`);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const historyRowsFromDB = [];
            for (let id in snap) {
                historyRowsFromDB.push({ id, ...snap[id] });
            }
            setHistoryRows(historyRowsFromDB);
        })
    }

    const deleteHistoryRow = async (id) => {
        const dbref = ref(db, `${DB_WEIGHT_HISTORY}/${currentUser.uid}/${id}`);
        remove(dbref);
    }

    return (
        <div>
            <GoBackButton />
            <PageTitle title={t('weighthistory')} iconName='weight' iconColor='gray' />
            <WeightChart data={historyRows} />
            {/* { <pre>{JSON.stringify(historyRows)}</pre> } */}
            {historyRows
                ? historyRows.map((row, index) =>
                    <div key={row.id}>
                        <p>
                            {getJsonAsDateTimeString(row.currentDateTime, i18n.language)}<br /> - {row.weight} kg, BMI: {row.bmi}

                            <Icon className='btn deleteBtn' name='times' color='red' fontSize='1.2em' cursor='pointer'
                                onClick={() => { if (window.confirm(t('delete_weighthistory_confirm_message'))) { deleteHistoryRow(row.id) } }} />
                        </p>
                    </div>
                ) : '-'
            }
        </div>
    )
}

export default WeightHistory