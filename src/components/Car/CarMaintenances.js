
import { useTranslation } from "react-i18next";
import PageTitle from '../Site/PageTitle';
import CarMaintenance from "./CarMaintenance";
import * as Constants from '../../utils/Constants';

export default function CarMaintenances({ carMaintenances, onDelete }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_CAR, { keyPrefix: Constants.TRANSLATION_CAR });

    // const mockData = () => {
    //     let data = [{ created: "2022-09-19T17:25:19.586Z", name: "Jarrunesteiden vaihto", price: 10, }]
    //     return data;
    // }

    const getMaintenancesPriceSum = (carMaintenances) => {
        let sum = 0;
        carMaintenances.forEach(maintenance => {
            if (maintenance.price > 0) {
                sum += parseInt(maintenance.price);
            }
        });
        return sum;
    }

    return (
        <>
            <PageTitle title={t('car_maintenances')} iconName={Constants.ICON_WRENCH} />
            <p>{t('maintenances_price_sum')}: {getMaintenancesPriceSum(carMaintenances)}</p>
            {carMaintenances.map((maintenance) => (
                <CarMaintenance key={maintenance.id} carMaintenance={maintenance} onDelete={onDelete} />
            ))}
        </>
    )
}