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
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    const getFuelingsPriceSum = (items) => {
        let sum = 0;
        items.forEach(fueling => {
            if (fueling.price > 0) {
                sum += parseFloat(fueling.price);
            }
        });
        return sum;
    }

    const getFuelingsPriceSumByFueler = (fuelings) => {
        const groupedByFueler = {};

        fuelings.forEach((fueling) => {
            const fuelerName = (fueling?.fuelerName || '').trim() || '-';
            const price = parseFloat(fueling?.price);

            if (!groupedByFueler[fuelerName]) {
                groupedByFueler[fuelerName] = {
                    totalPrice: 0,
                    count: 0,
                };
            }

            groupedByFueler[fuelerName].count += 1;

            if (Number.isFinite(price)) {
                groupedByFueler[fuelerName].totalPrice += price;
            }
        });

        return Object.entries(groupedByFueler)
            .map(([fuelerName, value]) => ({
                fuelerName,
                totalPrice: value.totalPrice,
                count: value.count,
            }))
            .sort((a, b) => b.totalPrice - a.totalPrice);
    }

    const fuelingTotalsByFueler = getFuelingsPriceSumByFueler(items);

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
                <Tab eventKey="fuelings-by-fueler" title={`${t('fueler_name')} €`}>
                    {fuelingTotalsByFueler.length > 0 ? (
                        <table className='table table-sm table-striped'>
                            <thead>
                                <tr>
                                    <th>{t('fueler_name')}</th>
                                    <th>{tCommon('amount')}</th>
                                    <th>{t('price')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fuelingTotalsByFueler.map((row) => (
                                    <tr key={row.fuelerName}>
                                        <td>{row.fuelerName}</td>
                                        <td>{row.count}</td>
                                        <td>{row.totalPrice.toFixed(2)} €</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>{t('no_car_fuelings')}</p>
                    )}
                </Tab>
            </Tabs>
        </>
    )
}


