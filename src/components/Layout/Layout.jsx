/** @jsxImportSource @emotion/react */
import * as s from "./styles";

function Layout({ children }) {
    return (
        <div css={s.container}>
            {children}
        </div>
    );
}

export default Layout;
