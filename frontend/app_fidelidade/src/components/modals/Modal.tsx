'use client'
//external dependencies
import React, { MouseEvent } from "react";

//internal dependencies
import { ModalContainer } from "./styled"

export interface ModalProps {
    isModalOpen: boolean
    onClose: () => void
    children: React.ReactNode
    width?: string
    height?: string
}
export default function Modal({isModalOpen, onClose, children, width, height}: ModalProps) {
    if (!isModalOpen) {
        return null
    }

    function handleOverlayClick(e: MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        onClose();
    };

    function handleContentClick(e: MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
    };
    
    return (
        <ModalContainer onClick={(e) => handleOverlayClick(e)} width={width} height={height}>
            <div className="modal-content" onClick={handleContentClick}>
                <button className="modal-close" onClick={onClose}>
                    <span className="material-symbols-outlined">close</span>
                </button>
                {children}
            </div>
        </ModalContainer>
    )
}