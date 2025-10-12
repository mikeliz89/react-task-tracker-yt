import GoBackButton from '../Buttons/GoBackButton';
import { useTranslation } from 'react-i18next';
import { getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { TRANSLATION, DB, ICONS, COLORS, LIST_TYPES } from '../../utils/Constants';
import i18n from 'i18next';
import { useAuth } from '../../contexts/AuthContext';
import WeightChart from './WeightChart';
import PageTitle from '../Site/PageTitle';
import PageContentWrapper from '../Site/PageContentWrapper';
import { removeFromFirebaseByIdAndSubId } from '../../datatier/datatier';
import useFetch from '../useFetch';
import DeleteButton from '../Buttons/DeleteButton';
import Counter from '../Site/Counter';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import { SortMode } from "../SearchSortFilter/SortModes";

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

    return loading ? (
        <h3>{tCommon("loading")}</h3>
    ) : (
        <PageContentWrapper>
            <GoBackButton />
            <PageTitle title={t('weighthistory')} iconName={ICONS.WEIGHT} iconColor={COLORS.GRAY} />
            <WeightChart data={historyRows} />
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
        </PageContentWrapper>
    )
}