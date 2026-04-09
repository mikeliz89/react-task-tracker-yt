import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../../contexts/AuthContext';
import { removeFromFirebaseByIdAndSubId } from '../../datatier/datatier';
import { TRANSLATION, DB, ICONS, COLORS, LIST_TYPES } from '../../utils/Constants';
import { getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import DeleteButton from '../Buttons/DeleteButton';
import useFetch from '../Hooks/useFetch';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import { SortMode } from "../SearchSortFilter/SortModes";
import Counter from '../Site/Counter';
import ManagePage from '../Site/ManagePage';

import WeightChart from './WeightChart';

export default function WeightHistory() {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.BMICALCULATOR });
const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //auth
    const { currentUser } = useAuth();

    //fetch data
    const { data: historyRows, setData: setHistoryRows,
        originalData: originalHistoryRows,
        counter, loading } = useFetch(DB.WEIGHT_HISTORY, LIST_TYPES.COMMON, currentUser.uid);

    const deleteHistoryRow = async (id) => {
        removeFromFirebaseByIdAndSubId(DB.WEIGHT_HISTORY, currentUser.uid, id);
    }

    return (
        <ManagePage
            loading={loading}
            loadingText={tCommon("loading")}
            title={t('weighthistory')}
            iconName={ICONS.WEIGHT}
            iconColor={COLORS.GRAY}
            hasItems={true}
            emptyText={''}
        >
            <>
                <p></p>

                {/* Kaavio */}
                <WeightChart data={historyRows} chartData={originalHistoryRows} />

                {/* Historiarivit */}
                <hr />
                <Counter counter={counter} text={tCommon('amount')} list={historyRows} originalList={originalHistoryRows} />
                <>
                    {
                        originalHistoryRows != null && originalHistoryRows.length > 0 ? (
                            <SearchSortFilter
                                onSet={setHistoryRows}
                                //search
                                originalList={originalHistoryRows}
                                //sort
                                defaultSort={SortMode.Created_ASC}
                                showSortByCreatedDate={true}
                            />
                        ) : (<></>)
                    }
                </>

                <h3>{t('history_rows')}</h3>
                {/* { <pre>{JSON.stringify(historyRows)}</pre> }  */}
                {historyRows != null && historyRows.length > 0 ? historyRows.map((row, index) =>
                    <div key={row.id}>
                        <p>
                            {getJsonAsDateTimeString(row.currentDateTime, i18n.language)}<br /> - {row.weight} kg, BMI: {row.bmi}

                            <DeleteButton
                                onDelete={deleteHistoryRow}
                                id={row.id}
                            />
                        </p>
                    </div>
                ) : '-'
                }
            </>
        </ManagePage>
    )
}


