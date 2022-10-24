
import { useTranslation } from "react-i18next";
import PageTitle from '../Site/PageTitle';
import CarFueling from "./CarFueling";
import * as Constants from '../../utils/Constants';
import GasPriceChart from './GasPriceChart';

const CarFuelings = ({ carFuelings, onDelete }) => {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_CAR, { keyPrefix: Constants.TRANSLATION_CAR });

    const mockData = () => {
        let data = [{ created: "2022-09-19T17:25:19.586Z", fuelPricePerLiter: "2.10" }]
        return data;
    }

    return (
        <>
            <PageTitle title={t('fuelings')} iconName={Constants.ICON_GAS_PUMP} />
            {carFuelings.map((fuelingRow) => (
                <CarFueling key={fuelingRow.id} fuelingRow={fuelingRow} onDelete={onDelete} />
            ))}

            <hr />
            <p>{t('fuel_price_chart')}</p>
            <GasPriceChart data={carFuelings} />
        </>
    )
}

export default CarFuelings
