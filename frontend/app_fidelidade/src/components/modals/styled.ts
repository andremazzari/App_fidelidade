'use client'
//external dependencies
import styled from "styled-components";

interface ModalContainerProps {
    width?: string
    height?: string
}
export const ModalContainer = styled.div<ModalContainerProps>`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* Ensures the overlay is above other content */

    & .modal-content {
        width: ${(props) => props.width ? props.width : '400px'};
        height: ${(props) => props.height ? props.height : '250px'};
        background: white;
        padding: 80px 10px;
        border-radius: 4px;
        position: relative;
        z-index: 1001; /* Ensures the modal content is above the overlay */
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    & .modal-close {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
    }
`;