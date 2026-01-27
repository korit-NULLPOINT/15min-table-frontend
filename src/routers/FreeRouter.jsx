import { Route, Routes } from 'react-router-dom';
import FreeListPage from '../pages/boards/free/free-list-page/FreeListPage';
import FreeWritePage from '../pages/boards/free/free-write-page/FreeWritePage';
import FreeEditPage from '../pages/boards/free/free-edit-page/FreeEditPage';
import FreeDetailPage from '../pages/boards/free/free-detail-page/FreeDetailPage';

export default function FreeRouter() {
    return (
        <Routes>
            <Route path="" element={<FreeListPage />} />
            <Route path="write" element={<FreeWritePage />} />
            <Route path=":freeId/edit" element={<FreeEditPage />} />
            <Route path=":freeId" element={<FreeDetailPage />} />
        </Routes>
    );
}
