/** @jsxImportSource @emotion/react */
import { IoMenu } from "react-icons/io5";
import * as s from "./style";
import { useNavigate } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
// import { usePrincipalState } from "../../store/usePrincipalState";

function MainHeader({ showSideBar, setShowSideBar }) {
    const navigate = useNavigate();
    // const { isLoggedIn, principal, loading, login, logout } =
    //     usePrincipalState();

    return (
        <div css={s.container}>
            <div css={s.leftBox}>
                <button>
                    <IoMenu />
                </button>
                <div>TechBoard</div>
            </div>
            <div css={s.rightBox}>
                <>
                    <button onClick={() => navigate("/auth/signin")}>
                        로그인
                    </button>
                    <button onClick={() => navigate("/auth/signup")}>
                        회원가입
                    </button>
                </>
            </div>
            <div css={s.sideBarContainer(showSideBar)}>
                <SideBar setShowSideBar={setShowSideBar} />
            </div>
        </div>
    );
}

export default MainHeader;