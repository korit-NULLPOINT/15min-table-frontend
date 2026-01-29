import { LineChart } from "@mui/x-charts/LineChart";

export default function UserLineChart() {
  return (
    <LineChart
      height={320}
      xAxis={[{ data: ["1주", "2주", "3주", "4주"] }]}
      series={[{ data: [10, 20, 35, 50], label: "사용자 수", color: "#1976d2" }]}
    />
  );
}
