// src/components/admin/charts/AdminMultiLineChart.jsx
import { LineChart } from '@mui/x-charts/LineChart';

export default function AdminMultiLineChart({ xLabels = [], series = [] }) {
    const safeSeries = Array.isArray(series) ? series : [];

    // console.log(xLabels);
    // console.log(series);
    // console.log(safeSeries);

    if (safeSeries.length === 0 || xLabels.length === 0) {
        return (
            <div
                style={{
                    height: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#8b7b70',
                }}
            >
                데이터 없음
            </div>
        );
    }

    // series에 connectNulls 옵션 추가하여 null 값에서도 선이 이어지도록 함
    const processedSeries = safeSeries.map((s) => ({
        ...s,
        connectNulls: true,
    }));

    return (
        <LineChart
            height={300}
            xAxis={[{ scaleType: 'point', data: xLabels }]}
            yAxis={[{ min: 0 }]}
            series={processedSeries}
            grid={{ horizontal: true }}
        />
    );
}
