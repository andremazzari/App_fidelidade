'use client'
//external dependencies
import { useEffect, useState } from "react"

//internal dependencies
import { CancelRecordContainer } from "./styled"
import Utils from "@/utils/Utils"
import CancelRecordModal from "@/components/modals/CancelRecordModal/CancelRecordModal"

interface CancelRecord {
    phone: number
    timestamp: string
    redeemed: boolean
    canceled?: boolean
    canceledAt?: string
}
export default function CancelRecord({phone, timestamp, redeemed, canceled, canceledAt}: CancelRecord) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isRecordCanceled, setIsRecordCanceled] = useState<boolean>(canceled ? true : false);
    const [canceledTimestamp, setCanceledTimestamp] = useState<string | undefined>(canceledAt);

    useEffect(() => {
        setIsRecordCanceled(canceled ? true : false);
        setCanceledTimestamp(canceledAt);
    }, [phone, timestamp, redeemed, canceled, canceledAt]);

    if (redeemed) {
        return (
            <span>-</span>
        )
    }
    
    return (
        <CancelRecordContainer className={!isRecordCanceled ? 'validRecord' : ''} >
            {!isRecordCanceled ?
            <>
                <span className="material-symbols-outlined validRecord" onClick={() => setIsModalOpen(true)}>cancel</span>
                <CancelRecordModal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)} phone={phone} timestamp={timestamp} setIsRecordCanceled={setIsRecordCanceled} setCanceledTimestamp={setCanceledTimestamp}/>
            </>
            :
            canceledTimestamp !== undefined ? Utils.formatTimestamp(canceledTimestamp) : 'Erro ao obter horário'
            }
            
        </CancelRecordContainer>
       
    )
}