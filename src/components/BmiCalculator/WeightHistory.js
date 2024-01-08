import GoBackButton from '../Buttons/GoBackButton';
import { useTranslation } from 'react-i18next';
import { getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import * as Constants from '../../utils/Constants';
import i18n from 'i18next';
import { useAuth } from '../../contexts/AuthContext';
import WeightChart from './WeightChart';
import PageTitle from '../Site/PageTitle';
import Icon from '../Icon';
import PageContentWrapper from '../Site/PageContentWrapper';
import { removeFromFirebaseByIdAndSubId } from '../../datatier/datatier';
import useFetch from '../useFetch';

export default function WeightHistory() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_BMICALCULATOR, { keyPrefix: Constants.TRANSLATION_BMICALCULATOR });

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
        <h3>{t('loading')}</h3>
    ) : (
        <PageContentWrapper>
            <GoBackButton />
            <PageTitle title={t('weighthistory')} iconName={Constants.ICON_WEIGHT} iconColor={Constants.COLOR_GRAY} />
            <WeightChart data={historyRows} />
            {/* { <pre>{JSON.stringify(historyRows)}</pre> } */}
            {historyRows != null && historyRows > 0 ? historyRows.map((row, index) =>
                <div key={row.id}>
                    <p>
                        {getJsonAsDateTimeString(row.currentDateTime, i18n.language)}<br /> - {row.weight} kg, BMI: {row.bmi}

                        <Icon className={'btn ' + Constants.CLASSNAME_DELETEBTN}
                            name={Constants.ICON_DELETE}
                            color={Constants.COLOR_DELETEBUTTON}
                            fontSize='1.2em'
                            cursor='pointer'
                            onClick={() => {
                                if (window.confirm(t('delete_weighthistory_confirm_message'))) {
                                    deleteHistoryRow(row.id)
                                }
                            }} />
                    </p>
                </div>
            ) : '-'
            }
        </PageContentWrapper>
    )
}