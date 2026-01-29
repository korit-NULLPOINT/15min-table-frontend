import { useSearchParams, useNavigate } from "react-router-dom";

import TotalOverviewChart from "./charts/TotalOverviewChart";
import UserLineChart from "./charts/UserLineChart";
import RecipeLineChart from "./charts/RecipeLineChart";
import CommunityLineChart from "./charts/CommunityLineChart";

export function AdminStats() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const type = params.get("type") || "users";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-[#3d3226]">통계</h1>
          <p className="text-[#6b5d4f] mt-1">전체 추세와 상세 추세를 확인합니다.</p>
        </div>

        <button
          className="px-4 py-2 border-2 border-[#3d3226] rounded-md hover:bg-[#3d3226] hover:text-[#f5f1eb] transition-colors"
          onClick={() => navigate("/admin/dashboard")}
        >
          대시보드로
        </button>
      </div>

      <div className="bg-white rounded-lg border-2 border-[#d4cbbf] p-6">
        <h2 className="text-xl font-serif text-[#3d3226] mb-4">전체 추세</h2>
        <TotalOverviewChart />
      </div>

      <div className="bg-white rounded-lg border-2 border-[#d4cbbf] p-6">
        <h2 className="text-xl font-serif text-[#3d3226] mb-4">
          {type === "users" && "사용자 상세 추세"}
          {type === "recipes" && "레시피 상세 추세"}
          {type === "community" && "커뮤니티 상세 추세"}
        </h2>

        {type === "users" && <UserLineChart />}
        {type === "recipes" && <RecipeLineChart />}
        {type === "community" && <CommunityLineChart />}
      </div>
    </div>
  );
}
