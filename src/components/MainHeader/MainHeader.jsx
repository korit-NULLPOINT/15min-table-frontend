/** @jsxImportSource @emotion/react */
import { IoMenu } from "react-icons/io5";
import * as s from "./style";
import { useNavigate } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import { usePrincipalState } from "../../store/usePrincipalState";

function MainHeader({ showSideBar, setShowSideBar }) {
    const navigate = useNavigate();
    const { isLoggedIn, principal, loading, login, logout } =
        usePrincipalState();

    return (
        <div css={s.container}>
            <div css={s.leftBox}>
                <button onClick={() => setShowSideBar((prev) => !prev)}>
                    <IoMenu />
                </button>
                <div onClick={() => navigate("/")}>TechBoard</div>
            </div>
            <div css={s.rightBox}>
                {loading ? (
                    <></>
                ) : isLoggedIn ? (
                    <div
                        css={s.profileBox}
                        onClick={() =>
                            navigate(`/profile/${principal.username}`)
                        }>
                        <img src={principal?.profileImg} alt="profileImg" />
                    </div>
                ) : (
                    <>
                        <button onClick={() => navigate("/auth/signin")}>
                            로그인
                        </button>
                        <button onClick={() => navigate("/auth/signup")}>
                            회원가입
                        </button>
                    </>
                )}
            </div>
            <div css={s.sideBarContainer(showSideBar)}>
                <SideBar setShowSideBar={setShowSideBar} />
            </div>
        </div>
    );
}

export default MainHeader;