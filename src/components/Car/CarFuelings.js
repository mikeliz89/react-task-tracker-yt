
import { useTranslation } from "react-i18next";
import PageTitle from '../Site/PageTitle';
import CarFueling from "./CarFueling";
import * as Constants from '../../utils/Constants';
import GasPriceChart from './GasPriceChart';

export default function CarFuelings({ carFuelings, onDelete }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_CAR });

    // const mockData = () => {
    //     let data = [{ created: "2022-09-19T17:25:19.586Z", fuelPricePerLiter: "2.10" }]
    //     return data;
    // }

    const getFuelingsPriceSum = (carFuelings) => {
        let sum = 0;
        carFuelings.forEach(fueling => {
            if (fueling.price > 0) {
                sum += parseFloat(fueling.price);
            }
        });
        return sum;
    }

    return (
        <>
            <PageTitle title={t('fuelings')} iconName={Constants.ICON_GAS_PUMP} />

            <p>{t('car_fuelings_price_sum')}: {getFuelingsPriceSum(carFuelings)}</p>

            {carFuelings.map((fuelingRow) => (
                <CarFueling key={fuelingRow.id} fuelingRow={fuelingRow} onDelete={onDelete} />
            ))}

            <hr />
            <p>{t('fuel_price_chart')}</p>
            <GasPriceChart data={carFuelings} />
        </>
    )
}