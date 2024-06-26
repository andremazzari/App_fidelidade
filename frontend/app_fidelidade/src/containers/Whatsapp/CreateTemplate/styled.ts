'use client'
//external dependencies
import styled from "styled-components"

export const CreateTemplateContainer = styled.div`
    width: 500px;
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    border-radius: 10px;
    margin-top: 20px;
    padding-bottom: 15px;

    & .containerTitle {
        width: 100%;
        padding: 3px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid black;
    }

    & .templateForm {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }

    & .formItem {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    & .formButton {
        display: flex;
        justify-content: center;
        cursor: pointer;
    }
`;