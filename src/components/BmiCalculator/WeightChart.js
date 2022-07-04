import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
//const data = [{ name: 'Page A', uv: 400, pv: 2400, amt: 2400 }];

const WeightChart = ({ data }) => {
    return (
        <div>
            {/* <pre>{JSON.stringify(data)}</pre> */}
            <LineChart width={800} height={300} data={data}>
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

export default WeightChart
