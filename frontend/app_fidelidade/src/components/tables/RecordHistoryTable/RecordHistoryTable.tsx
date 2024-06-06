'use client'
//external dependencies
import { useState } from "react"

//internal dependencies
import Utils from "@/utils/Utils"
import { HistoryTableStyled } from "../styled"
import CancelRecord from "@/components/buttons/CancelRecord/CancelRecord"

export interface RecordHistoryTableProps {
    initialData: any[]
    includeRedeemInfo: boolean
}
export default function RecordHistoryTable({initialData, includeRedeemInfo}: RecordHistoryTableProps) {
    
    return (
        <HistoryTableStyled>
            <thead>
                <tr>
                    <th>Telefone</th>
                    <th>Criação</th>
                    {includeRedeemInfo ? <th>Resgate</th> : ''}
                    <th>Excluir</th>
                </tr>
            </thead>
            <tbody>
                {
                    initialData.map((record, index) => (
                        <tr className={index % 2 == 0 ? 'evenrow' : 'oddrow'} key={index}>
                            <td>{Utils.formatPhone(record.phone)}</td>
                            <td>{Utils.formatTimestamp(record.created_at)}</td>
                            {includeRedeemInfo && record.redeemed_at != null ? <td>{Utils.formatTimestamp(record.redeemed_at)}</td> :  ''}
                            {includeRedeemInfo && record.redeemed_at == null ? <td><span>-</span></td> :  ''}
                            <td><CancelRecord phone={record.phone} timestamp={record.created_at} redeemed={record.redeemed_at != null ? true : false} canceled={record.canceled_at != null ? true : false} canceledAt={record.canceled_at != null ? record.canceled_at : undefined}/></td>
                        </tr>
                    ))
                }
            </tbody>
        </HistoryTableStyled>
    )
}