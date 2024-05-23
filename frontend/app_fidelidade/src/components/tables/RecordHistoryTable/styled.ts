'use client'
//external dependencies
import styled from "styled-components";

export const RecordHistoryTableStyled = styled.table`
    width: 100%;
    border: 2px solid black;
    border-radius: 15px;
    overflow: hidden;
    border-spacing: 0;
    //border-collapse: collapse;

    & th, td {
        padding: 8px; /* Add padding to table cells for spacing */
        text-align: center; /* Center-align text within table cells */
        border: 0;
    }

    & td {
        font-weight: 500;
    }

    & .oddrow {
        background-color: rgb(206, 206, 206);
    }

    & .evenrow {
        background-color: white;
    }

    & .evenrow:hover, .oddrow:hover {
        background-color: rgb(148, 147, 147);
    }
`;