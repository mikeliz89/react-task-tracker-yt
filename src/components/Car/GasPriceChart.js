import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

import { ICONS, TRANSLATION } from '../../utils/Constants';
import { formatDate, sortChartDataByDate } from '../../utils/DateTimeUtils';
import Button from '../Buttons/Button';

export default function GasPriceChart({ data }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.SEARCHSORTFILTER });
    const { t: tCar } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.CAR });

    const [isCreatedDateAsc, setIsCreatedDateAsc] = useState(true);

    const sortedChartData = useMemo(() => sortChartDataByDate(data, 'created', isCreatedDateAsc), [data, isCreatedDateAsc]);

    return (
        <div>
            <Button
                iconName={isCreatedDateAsc ? ICONS.ARROW_UP : ICONS.ARROW_DOWN}
                onClick={() => setIsCreatedDateAsc(!isCreatedDateAsc)}
                text={t('created_date')}
                type="button" />

            {/* <pre>{JSON.stringify(data)}</pre> */}
            <LineChart width={800} height={300} data={sortedChartData}>
                <Line type="monotone" dataKey="fuelPricePerLiter" name={tCar('fuel_price_chart_unit')} stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="created" tickFormatter={formatDate} />
                <YAxis type="number" domain={[1, 3]} />
                <Tooltip labelFormatter={formatDate} />
                <Legend />
            </LineChart>
        </div>
    )
}


