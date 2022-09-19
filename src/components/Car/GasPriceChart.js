
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

function GasPriceChart({ data }) {
    return (
        <div>
            {/* <pre>{JSON.stringify(data)}</pre> */}
            <LineChart width={800} height={300} data={data}>
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

export default GasPriceChart