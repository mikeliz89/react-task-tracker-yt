import GoBackButton from '../Buttons/GoBackButton';
import { useTranslation } from 'react-i18next';
import { getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import * as Constants from '../../utils/Constants';
import i18n from 'i18next';
import { useAuth } from '../../contexts/AuthContext';
import WeightChart from './WeightChart';
import PageTitle from '../Site/PageTitle';
import PageContentWrapper from '../Site/PageContentWrapper';
import { removeFromFirebaseByIdAndSubId } from '../../datatier/datatier';
import useFetch from '../useFetch';
import DeleteButton from '../Buttons/DeleteButton';
import Counter from '../Site/Counter';

export default function WeightHistory() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_BMICALCULATOR });
    const { t: tCommon } = useTranslation(Constants.TRANSLATION_COMMON, { keyPrefix: Constants.TRANSLATION_COMMON });
    const { t: tCommonConfirm } = useTranslation(Constants.TRANSLATION_COMMON, { keyPrefix: Constants.TRANSLATION_COMMON_CONFIRM });

    //auth
    const { currentUser } = useAuth();

    //fetch data
    const { data: historyRows, setData: setHistoryRows,
        originalData: originalHistoryRows,
        counter, loading } = useFetch(Constants.DB_WEIGHT_HISTORY, Constants.LIST_TYPE_COMMON, currentUser.uid);

    const deleteHistoryRow = async (id) => {
        removeFromFirebaseByIdAndSubId(Constants.DB_WEIGHT_HISTORY, currentUser.uid, id);
    }

    return loading ? (
        <h3>{tCommon("loading")}</h3>
    ) : (
        <PageContentWrapper>
            <GoBackButton />
            <PageTitle title={t('weighthistory')} iconName={Constants.ICON_WEIGHT} iconColor={Constants.COLOR_GRAY} />
            <WeightChart data={historyRows} />
            <Counter counter={counter} text={tCommon('amount')} list={historyRows} originalList={originalHistoryRows} />
             {/* { <pre>{JSON.stringify(historyRows)}</pre> }  */}
             {historyRows != null && historyRows.length > 0 ? historyRows.map((row, index) =>
                <div key={row.id}>
                    <p>
                        {getJsonAsDateTimeString(row.currentDateTime, i18n.language)}<br /> - {row.weight} kg, BMI: {row.bmi}

                        <DeleteButton
                            confirmMessage={tCommon('confirm.areyousure')}
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