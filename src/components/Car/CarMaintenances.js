import { useTranslation } from "react-i18next";

import { TRANSLATION, ICONS } from '../../utils/Constants';
import PageTitle from '../Site/PageTitle';

import CarMaintenance from "./CarMaintenance";

export default function CarMaintenances({ carId, carMaintenances, onDelete }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.CAR });

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
            <PageTitle title={t('car_maintenances')} iconName={ICONS.WRENCH} />
            <p>{t('maintenances_price_sum')}: {getMaintenancesPriceSum(carMaintenances)}</p>
            {carMaintenances.map((maintenance) => (
                <CarMaintenance key={maintenance.id} carId={carId} carMaintenance={maintenance} onDelete={onDelete} />
            ))}
        </>
    )
}


