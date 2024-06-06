'use client'
//external dependencies
import styled from "styled-components";

export const CancelRecordContainer = styled.div`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    & .validRecord {
        cursor: pointer;
    }

    & .validRecord:hover {
        color: rgb(141, 23, 23);
    }
    
`;