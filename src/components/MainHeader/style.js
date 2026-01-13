import { css } from "@emotion/react";

export const container = css`
    width: 100%;
    height: 80px;
    padding: 0 200px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #dbdbdb;
    flex-shrink: 0;
`;

export const leftBox = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;

    & > button {
        border: none;
        background-color: transparent;
        border-radius: 8px;
        width: 36px;
        height: 36px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        font-weight: 500;
        transition: all 0.15s ease;
        cursor: pointer;

        &:hover {
            background-color: #f2f2f2;
        }
    }

    & > div {
        font-size: 18px;
        font-weight: 700;
        color: oklch(51.1% 0.262 276.966);
        cursor: pointer;
    }
`;

export const rightBox = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;

    & > button {
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 14px;
        transition: all 0.15s ease;
        cursor: pointer;
    }

    & > button:nth-of-type(1) {
        background-color: transparent;
        &:hover {
            background-color: #f2f2f2;
        }
    }

    & > button:nth-of-type(2) {
        background: #4f39f6;
        background: linear-gradient(
            90deg,
            rgba(79, 57, 246, 0.9) 0%,
            rgba(152, 16, 250, 0.9) 100%
        );
        color: white;

        &:hover {
            background: linear-gradient(
                90deg,
                rgba(79, 57, 246, 1) 0%,
                rgba(152, 16, 250, 1) 100%
            );
        }
    }
`;

export const sideBarContainer = (showSideBar) => css`
    position: absolute;
    z-index: 100;
    top: 0;
    left: ${showSideBar ? "0" : "-300px"};
    transition: all 0.15s ease-in-out;
`;

export const profileBox = css`
    width: 45px;
    height: 45px;
    border-radius: 50px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    & > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;