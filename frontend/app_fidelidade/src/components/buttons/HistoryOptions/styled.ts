'use client'
//external dependencies
import styled from "styled-components";

export const ToogleButtonContainer = styled.div`
    
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;
    cursor: pointer;

    & .optionContainer {
        width: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 9px;
        border: 1px solid black;
    }

    & .selectedOption {
        font-weight: bold;
        text-decoration: underline;
    }
`;