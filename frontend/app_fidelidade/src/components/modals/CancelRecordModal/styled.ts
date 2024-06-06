'use client'
//external dependencies
import styled from "styled-components";

export const CancelRecordModalContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    & .buttons-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 25px;
    }

    & .modal-button {
        padding: 5px;
        cursor: pointer;
    }

    & .cancel-button {
        background-color: red;
        color: white;
    }
`;