'use client'
//external dependencies
import styled from "styled-components"

export const RecordHistoryContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 60%;
`;

export const RecordHistoryHeaderForm = styled.form`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 20px;

    & .RecordHistoryFilters {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
`;

export const PaginationForm = styled.form`
    display: flex;
`;
