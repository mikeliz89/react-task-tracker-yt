
//react
import { useTranslation } from "react-i18next";
//pagetitle
import PageTitle from "../PageTitle";
//car
import CarFueling from "./CarFueling";
//utils
import * as Constants from '../../utils/Constants';

const CarFuelings = ({ carFuelings, onDelete }) => {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_CAR, { keyPrefix: Constants.TRANSLATION_CAR });

    return (
        <>
            <PageTitle title={t('fuelings')} iconName='gas-pump' />
            {carFuelings.map((fuelingRow) => (
                <CarFueling key={fuelingRow.id} fuelingRow={fuelingRow} onDelete={onDelete} />
            ))}
        </>
    )
}

export default CarFuelings
