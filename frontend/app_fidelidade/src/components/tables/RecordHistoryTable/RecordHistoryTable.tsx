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
                    <th>Pontos</th>
                    {includeRedeemInfo ? <th>Resgate</th> : ''}
                    <th>Excluir</th>
                </tr>
            </thead>
            <tbody>
                {
                    initialData.map((record, index) => (
                        <tr className={index % 2 == 0 ? 'evenrow' : 'oddrow'} key={index}>
                            <td>{Utils.formatPhone(record.phone)}</td>
                            <td>{Utils.formatTimestamp(record.createdAt)}</td>
                            <td>{record.points}</td>
                            {includeRedeemInfo && record.redeemedAt != null ? <td>{Utils.formatTimestamp(record.redeemedAt)}</td> :  ''}
                            {includeRedeemInfo && record.redeemedAt == null ? <td><span>-</span></td> :  ''}
                            <td><CancelRecord phone={record.phone} timestamp={record.createdAt} redeemed={record.redeemedAt != null ? true : false} canceled={record.canceledAt != null ? true : false} canceledAt={record.canceledAt != null ? record.canceledAt : undefined}/></td>
                        </tr>
                    ))
                }
            </tbody>
        </HistoryTableStyled>
    )
}