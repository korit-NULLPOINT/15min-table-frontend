import { LineChart } from "@mui/x-charts/LineChart";

export default function RecipeLineChart() {
  return (
    <LineChart
      height={320}
      xAxis={[{ data: ["1주", "2주", "3주", "4주"] }]}
      series={[{ data: [5, 12, 18, 30], label: "레시피 수", color: "#2e7d32" }]}
    />
  );
}
