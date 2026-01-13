import { css } from "@emotion/react";

export const container = css`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: auto;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
        display: none;
    }
`;

export const blurBox = (showSideBar) => css`
    ${showSideBar ? "filter: blur(4px);" : ""}
    height: 100%;
`;