import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

import { ICONS, TRANSLATION } from '../../utils/Constants';
import { formatDate, sortChartDataByDate } from '../../utils/DateTimeUtils';
import Button from '../Buttons/Button';

export default function WeightChart({ data, chartData }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.SEARCHSORTFILTER });
    const { t: tBmi } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.BMICALCULATOR });

    const [isDateAsc, setIsDateAsc] = useState(true);

    const sortedChartData = useMemo(() => {
        const sourceData = Array.isArray(chartData) ? chartData : data;
        return sortChartDataByDate(sourceData, 'currentDateTime', isDateAsc);
    }, [data, chartData, isDateAsc]);

    const yAxisDomain = useMemo(() => {
        const weights = sortedChartData
            .map((item) => Number(item.weight))
            .filter((value) => Number.isFinite(value));

        if (weights.length === 0) {
            return [0, 100];
        }

        const min = Math.min(...weights);
        const max = Math.max(...weights);

        if (min === max) {
            const padding = Math.max(1, Math.ceil(max * 0.05));
            return [Math.max(0, Math.floor(min - padding)), Math.ceil(max + padding)];
        }

        const range = max - min;
        const padding = Math.max(1, Math.ceil(range * 0.1));

        return [Math.max(0, Math.floor(min - padding)), Math.ceil(max + padding)];
    }, [sortedChartData]);

    return (
        <div>
            <Button
                iconName={isDateAsc ? ICONS.ARROW_UP : ICONS.ARROW_DOWN}
                onClick={() => setIsDateAsc(!isDateAsc)}
                text={t('created_date')}
                type="button" />

            {/* <pre>{JSON.stringify(data)}</pre> */}
            <LineChart width={800} height={300} data={sortedChartData}>
                <Line type="monotone" dataKey="weight" name={tBmi('weight')} stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="currentDateTime" tickFormatter={formatDate} />
                <YAxis type="number" domain={yAxisDomain} />
                <Tooltip labelFormatter={formatDate} />
                <Legend />
            </LineChart>
        </div>
    )
}



