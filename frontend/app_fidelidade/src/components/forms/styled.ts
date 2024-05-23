"use client"
//external dependencies
import styled from "styled-components";

export const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
`;

interface LoginformItemProps {
    marginbottom: string
}
export const FormItem = styled.div<LoginformItemProps>`
    margin-bottom: ${props => props.marginbottom};
`;

export const FormButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
`;

export const FormButton = styled.button`
    border: 1px solid black;
    border-radius: 5px;
    height: 40px;
    width: 60px;
`