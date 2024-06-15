'use client'
//external dependencies
import styled from "styled-components";

export const SearchWhatsappTemplateContainer = styled.div`
    width: 500px;
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    border-radius: 10px;
    margin-top: 20px;
    padding-bottom: 15px;

    & .searchForm {
        width: 100%;
        border-bottom: 1px solid black;
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
        justify-content: space-around;
    }

    & .templateItem:hover {
        background-color: rgb(190, 190, 190);
    }

    & .templateItemInfo {
        display: flex;
        flex-direction: column;
    }

    & .templateItemButtonContainer {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;