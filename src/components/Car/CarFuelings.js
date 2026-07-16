// const mockData = () => {
//     let data = [{ created: "2022-09-19T17:25:19.586Z", fuelPricePerLiter: "2.10" }]
//     return data;
// }
import { Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from "react-i18next";

import { TRANSLATION, ICONS } from '../../utils/Constants';
import PageTitle from '../Site/PageTitle';

import CarFueling from "./CarFueling";
import GasPriceChart from './GasPriceChart';

export default function CarFuelings({ carId, items, chartFuelings, onDelete }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.CAR });

    const getFuelingsPriceSum = (items) => {
        let sum = 0;
        items.forEach(fueling => {
            if (fueling.price > 0) {
                sum += parseFloat(fueling.price);
            }
        });
        return sum;
    }

    return (
        <>
            <PageTitle title={t('fuelings')} iconName={ICONS.GAS_PUMP} />

            <Tabs defaultActiveKey="fuelings-list" id="car-fuelings-tabs" className="mb-3">
                <Tab eventKey="fuelings-list" title={t('fuelings')}>
                    <p>{t('car_fuelings_price_sum')}: {getFuelingsPriceSum(items)}</p>

                    {items.map((fuelingRow) => (
                        <CarFueling key={fuelingRow.id} carId={carId} fuelingRow={fuelingRow} onDelete={onDelete} />
                    ))}
                </Tab>
                <Tab eventKey="fuel-price-development" title={t('fuel_price_chart')}>
                    <GasPriceChart data={chartFuelings ?? items} />
                </Tab>
            </Tabs>
        </>
    )
}


