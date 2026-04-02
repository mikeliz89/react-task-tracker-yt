
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Button from '../Buttons/Button';
import { ICONS, TRANSLATION } from '../../utils/Constants';

export default function GasPriceChart({ data }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.SEARCHSORTFILTER });

    const [isCreatedDateAsc, setIsCreatedDateAsc] = useState(true);

    const sortedChartData = useMemo(() => {
        if (!Array.isArray(data)) return [];

        const sorted = [...data].sort((a, b) => new Date(a.created) - new Date(b.created));
        if (!isCreatedDateAsc) {
            sorted.reverse();
        }
        return sorted;
    }, [data, isCreatedDateAsc]);

    return (
        <div>
            <Button
                iconName={isCreatedDateAsc ? ICONS.ARROW_UP : ICONS.ARROW_DOWN}
                onClick={() => setIsCreatedDateAsc(!isCreatedDateAsc)}
                text={t('created_date')}
                type="button" />

            {/* <pre>{JSON.stringify(data)}</pre> */}
            <LineChart width={800} height={300} data={sortedChartData}>
                <Line type="monotone" dataKey="fuelPricePerLiter" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="created" />
                <YAxis type="number" domain={[1, 3]} />
                <Tooltip />
                <Legend />
            </LineChart>
        </div>
    )
}