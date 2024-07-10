'use client'
//external dependencies
import { useState } from "react"

//internal dependencies
import Utils from "@/utils/Utils"
import { HistoryTableStyled } from "../styled"

export interface RedeemHistoryTableProps {
    initialData: any[]
}
export default function RedeemHistoryTable({initialData}: RedeemHistoryTableProps) {
    return (
        <HistoryTableStyled>
            <thead>
                <tr>
                    <th>Telefone</th>
                    <th>Data e horário</th>
                    <th>Pontos resgatados</th>
                </tr>
            </thead>
            <tbody>
                {
                    initialData.map((record, index) => (
                        <tr className={index % 2 == 0 ? 'evenrow' : 'oddrow'} key={index}>
                            <td>{Utils.formatPhone(record.phone)}</td>
                            <td>{Utils.formatTimestamp(record.createdAt)}</td>
                            <td>{record.points}</td>
                        </tr>
                    ))
                }
            </tbody>
        </HistoryTableStyled>
    )
}