import GoBackButton from '../GoBackButton';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react'
import { db } from '../../firebase-config';
import { ref, onValue } from "firebase/database";
import { getJsonAsDateTimeString } from '../../utils/DateTimeUtils'
import i18n from "i18next";

const WeightHistory = () => {

    const { t } = useTranslation();
    const { currentUser } = useAuth();

    //states
    const [historyRows, setHistoryRows] = useState()

    //load data
    useEffect(() => {
        let cancel = false;

        const getHistoryRows = async () => {
            if(cancel) {
                return;
            }
            await fetchHistoryRowsFromFirebase()
        }
        getHistoryRows()

        return () => { 
            cancel = true;
        }
    }, [])

    /** Fetch Weight History Rows From Firebase */
    const fetchHistoryRowsFromFirebase = async () => {
        const dbref = await ref(db, '/weighthistory/' + currentUser.uid);
        onValue(dbref, (snapshot) => {
        const snap = snapshot.val();
            const historyRowsFromDB = [];
            for(let id in snap) {
                historyRowsFromDB.push({id, ...snap[id]});
            }
            setHistoryRows(historyRowsFromDB);
        })
    }

    return (
        <div>
            <GoBackButton />
            <h3 className="page-title">{t('weighthistory')}</h3>
            {/* { <pre>{JSON.stringify(historyRows)}</pre> } */}
            {historyRows 
          ? historyRows.map((row, index) =>
          <div key={row.id}>
            <p>
            {getJsonAsDateTimeString(row.currentDateTime, i18n.language)}<br/> - {row.weight} kg, BMI: {row.bmi}
            </p>
        </div>
        ) : '-'
        }
        </div>
    )
}

export default WeightHistory