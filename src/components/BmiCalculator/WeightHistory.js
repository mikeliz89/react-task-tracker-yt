import GoBackButton from '../Buttons/GoBackButton';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react'
import { db } from '../../firebase-config';
import { ref, onValue } from 'firebase/database';
import { getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import * as Constants from '../../utils/Constants';
import i18n from 'i18next';
import { useAuth } from '../../contexts/AuthContext';
import WeightChart from './WeightChart';
import PageTitle from '../Site/PageTitle';
import Icon from '../Icon';
import PageContentWrapper from '../Site/PageContentWrapper';
import { removeFromFirebaseByIdAndSubId } from '../../datatier/datatier';

export default function WeightHistory() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_BMICALCULATOR, { keyPrefix: Constants.TRANSLATION_BMICALCULATOR });

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
            await fetchHistoryRowsFromFirebase();
        }
        getHistoryRows();

        return () => {
            cancel = true;
        }
    }, [])

    const fetchHistoryRowsFromFirebase = async () => {
        const dbref = await ref(db, `${Constants.DB_WEIGHT_HISTORY}/${currentUser.uid}`);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            for (let id in snap) {
                fromDB.push({ id, ...snap[id] });
            }
            setHistoryRows(fromDB);
        })
    }

    const deleteHistoryRow = async (id) => {
        removeFromFirebaseByIdAndSubId(Constants.DB_WEIGHT_HISTORY, currentUser.uid, id);
    }

    return (
        <PageContentWrapper>
            <GoBackButton />
            <PageTitle title={t('weighthistory')} iconName={Constants.ICON_WEIGHT} iconColor='gray' />
            <WeightChart data={historyRows} />
            {/* { <pre>{JSON.stringify(historyRows)}</pre> } */}
            {historyRows
                ? historyRows.map((row, index) =>
                    <div key={row.id}>
                        <p>
                            {getJsonAsDateTimeString(row.currentDateTime, i18n.language)}<br /> - {row.weight} kg, BMI: {row.bmi}

                            <Icon className='btn deleteBtn'
                                name={Constants.ICON_DELETE}
                                color={Constants.COLOR_DELETEBUTTON}
                                fontSize='1.2em'
                                cursor='pointer'
                                onClick={() => { if (window.confirm(t('delete_weighthistory_confirm_message'))) { deleteHistoryRow(row.id) } }} />
                        </p>
                    </div>
                ) : '-'
            }
        </PageContentWrapper>
    )
}