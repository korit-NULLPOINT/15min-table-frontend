import { LineChart } from "@mui/x-charts/LineChart";

export default function CommunityLineChart() {
  return (
    <LineChart
      height={320}
      xAxis={[{ data: ["1주", "2주", "3주", "4주"] }]}
      series={[{ data: [2, 8, 15, 22], label: "게시글 수", color: "#ed6c02" }]}
    />
  );
}
