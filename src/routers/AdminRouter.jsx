// src/routers/AdminRouter.jsx
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminPage from '../pages/admin/admin-page/AdminPage';

export default function AdminRouter() {
    return (
        <Routes>
            {/* /admin 또는 /admin/ -> /admin/dashboard */}
            <Route path="" element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminPage />} />
            <Route path="users" element={<AdminPage />} />
            <Route path="recipes" element={<AdminPage />} />
            <Route path="community" element={<AdminPage />} />

            {/* 나머지 잘못된 경로는 대시보드로 */}
            <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
    );
}
