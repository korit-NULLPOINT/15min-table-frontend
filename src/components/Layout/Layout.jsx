/** @jsxImportSource @emotion/react */
import MainPage from "../../pages/MainPage/MainPage";
import MainHeader from "../MainHeader/MainHeader";
import * as s from "./styles";

function Layout() {
    return (
        <div css={s.container}>
            <MainHeader />
            <div>
                <MainPage />
            </div>
        </div>
    );
}

export default Layout;
