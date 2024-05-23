'use client'
//external dependencies
import styled from "styled-components"

export const FidelityConfigForm = styled.form`
    width: 60%;
    border: 1px solid black;
    border-radius: 10px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    

    & #fidelityTargetInput {
        width: 30px;
    }
`;