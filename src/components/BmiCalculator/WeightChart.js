import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Button from '../Buttons/Button';
import { ICONS, TRANSLATION } from '../../utils/Constants';
//const data = [{ name: 'Page A', uv: 400, pv: 2400, amt: 2400 }];

export default function WeightChart({ data, chartData }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.SEARCHSORTFILTER });

    const [isDateAsc, setIsDateAsc] = useState(true);

    const sortedChartData = useMemo(() => {
        const sourceData = Array.isArray(chartData) ? chartData : data;
        if (!Array.isArray(sourceData)) return [];

        const sorted = [...sourceData].sort((a, b) => new Date(a.currentDateTime) - new Date(b.currentDateTime));
        if (!isDateAsc) {
            sorted.reverse();
        }
        return sorted;
    }, [data, chartData, isDateAsc]);

    return (
        <div>
            <Button
                iconName={isDateAsc ? ICONS.ARROW_UP : ICONS.ARROW_DOWN}
                onClick={() => setIsDateAsc(!isDateAsc)}
                text={t('created_date')}
                type="button" />

            {/* <pre>{JSON.stringify(data)}</pre> */}
            <LineChart width={800} height={300} data={sortedChartData}>
                <Line type="monotone" dataKey="weight" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="currentDateTime" />
                <YAxis type="number" domain={[80, 100]} />
                <Tooltip />
                <Legend />
            </LineChart>
        </div>
    )
}
