'use client'
//external dependencies
import { useState, useEffect } from "react";

//internal dependencies
import { ToogleButtonContainer } from "./styled";

interface HistoryOptionsButtonProps {
    option1Name: string
    option2Name: string
    optionSetter: React.Dispatch<React.SetStateAction<boolean>>
}
export default function HistoryOptionsButton({option1Name, option2Name, optionSetter}:HistoryOptionsButtonProps) {
    const [isOptions1Selected, setIsOption1Selected] = useState(true);

    useEffect(() => {
        optionSetter(isOptions1Selected);
    }, [isOptions1Selected])

    return (
        <ToogleButtonContainer>
            <div className={isOptions1Selected ? 'optionContainer selectedOption' : 'optionContainer'} onClick={() => setIsOption1Selected(true)}>
                {option1Name}
            </div>
            <div className={!isOptions1Selected ? 'optionContainer selectedOption' : 'optionContainer'} onClick={() => setIsOption1Selected(false)}>
                {option2Name}
            </div>
        </ToogleButtonContainer>
    )
}