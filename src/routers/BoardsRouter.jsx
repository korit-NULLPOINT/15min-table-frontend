import { Route, Routes } from 'react-router-dom';
import RecipeRouter from './RecipeRouter';
import FreeRouter from './FreeRouter';

export default function BoardsRouter() {
    return (
        <Routes>
            <Route path=":boardId/recipe/*" element={<RecipeRouter />} />
            <Route path=":boardId/free/*" element={<FreeRouter />} />
            {/* <Route path="qna/*" element={<QnaRouter />} /> */}
            {/* <Route path="notice/*" element={<NoticeRouter />} /> */}
        </Routes>
    );
}
