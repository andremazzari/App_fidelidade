'use client'
//external dependencies
import styled from "styled-components"

//TEMP: unify with the components and styles of searchWhatsappTemplate
export const RegisteredTemplatesComponents = styled.div`
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

    & .templateList {
        width: 100%;
        list-style-type: none;
    }

    & .templateItem {
        width: 100%;
        padding: 10px 15px;
        display: flex;
        flex-direction: row;
        gap: 15px;
        cursor: pointer;
    }

    & .templateItem:hover {
        background-color: rgb(190, 190, 190);
    }
`;