// src/components/admin/AdminLineChart.jsx
import { LineChart } from "@mui/x-charts/LineChart";

export default function AdminLineChart({ data, color}) {
  const safeData = Array.isArray(data) ? data : [];

  if (safeData.length === 0) {
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
      xAxis={[
        {
          scaleType: "point",
          data: safeData.map((d) => d.label),
        },
      ]}
      series={[
        {
          data: safeData.map((d) => d.value),
          color,
        },
      ]}
      grid={{ horizontal: true }}
    />
  );
}
