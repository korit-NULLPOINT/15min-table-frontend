import { css } from "@emotion/react";

export const container = css`
    width: 100vw;
    height: 100%;
    background: #eef2ff;
    background: linear-gradient(
        90deg,
        rgba(238, 242, 255, 1) 0%,
        rgba(250, 245, 255, 1) 50%,
        rgba(253, 242, 248, 1) 100%
    );
    padding: 0 200px;
    box-sizing: border-box;
    transition: all 0.2s ease-in-out;
`;

export const mainContainer = css`
    width: 100%;
    height: 100%;
    padding: 70px 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    gap: 50px;
`;
