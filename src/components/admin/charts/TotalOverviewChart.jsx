import { LineChart } from '@mui/x-charts/LineChart';

export default function TotalOverviewChart() {
    return (
        <LineChart
            height={300}
            xAxis={[
                {
                    data: ['1주', '2주', '3주', '4주'],
                    scaleType: 'point',
                },
            ]}
            series={[
                { data: [10, 20, 35, 50], label: '사용자' },
                { data: [5, 12, 18, 30], label: '레시피' },
                { data: [2, 8, 15, 22], label: '커뮤니티' },
            ]}
        />
    );
}
