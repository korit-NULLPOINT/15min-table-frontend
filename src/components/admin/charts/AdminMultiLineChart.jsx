// src/components/admin/charts/AdminMultiLineChart.jsx
import { LineChart } from "@mui/x-charts/LineChart";

export default function AdminMultiLineChart({ xLabels = [], series = [] }) {
  const safeSeries = Array.isArray(series) ? series : [];

  if (safeSeries.length === 0 || xLabels.length === 0) {
    return (
      <div
        style={{
          height: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#8b7b70",
        }}
      >
        데이터 없음
      </div>
    );
  }

  return (
    <LineChart
      height={300}
      xAxis={[{ scaleType: "point", data: xLabels }]}
      series={safeSeries}
      grid={{ horizontal: true }}
    />
  );
}
