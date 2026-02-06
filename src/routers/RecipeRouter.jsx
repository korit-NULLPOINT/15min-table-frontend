import { Route, Routes, Navigate } from 'react-router-dom';
import RecipeListPage from '../pages/boards/recipe/recipe-list-page/RecipeListPage';
import RecipeDetailPage from '../pages/boards/recipe/recipe-detail-page/RecipeDetailPage';
import RecipeWritePage from '../pages/boards/recipe/recipe-write-page/RecipeWritePage';
import RecipeEditPage from '../pages/boards/recipe/recipe-edit-page/RecipeEditPage';

export default function RecipeRouter() {
    return (
        <Routes>
            <Route path="" element={<RecipeListPage />} />
            <Route path="filtered" element={<Navigate to=".." replace />} />
            <Route path="write" element={<RecipeWritePage />} />
            <Route path=":recipeId/edit" element={<RecipeEditPage />} />
            <Route path=":recipeId" element={<RecipeDetailPage />} />
        </Routes>
    );
}
