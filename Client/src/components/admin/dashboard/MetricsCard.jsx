import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';

const COLORS = ["#0088FE", "#00C49F"];

const MetricsCard = ({ title, data, type }) => {
    return (
        <div className="bg-white shadow-md p-4 rounded-lg">
            <h2 className="text-lg font-medium text-gray-800">{title}</h2>
            <div className="h-40 flex justify-center items-center">
                {type === "bar" ? (
                    <BarChart
                        series={[{ data: data.map(d => d.value), label: "Value" }]}
                        xAxis={[{ scaleType: "band", data: data.map(d => d.name) }]}
                        width={300}
                        height={150}
                    />
                ) : type === "pie" ? (
                    <PieChart
                        series={[
                            {
                                data: data.map((d, index) => ({
                                    id: index,
                                    value: d.value,
                                    label: d.name,
                                    color: COLORS[index % COLORS.length]
                                }))
                            }
                        ]}
                        width={300}
                        height={150}
                    />
                ) : (
                    <p>No chart type found</p>
                )}
            </div>
        </div>
    );
};

export default MetricsCard;
