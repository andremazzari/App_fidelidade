'use client'
//external dependencies
import { useState } from "react"

//internal dependencies
import Utils from "@/utils/Utils"
import { RecordHistoryTableStyled } from "./styled"

export interface RecordHistoryTableProps {
    initialData: any[]
}
export default function RecordHistoryTable({initialData}: RecordHistoryTableProps) {
    //TEMP: if not in use, remove initialPageNumber
    const [tableData, setTableData] = useState(initialData);


    return (
        <RecordHistoryTableStyled>
            <thead>
                <tr>
                    <th>Telefone</th>
                    <th>Data e horário</th>
                </tr>
            </thead>
            <tbody>
                {
                    initialData.map((record, index) => (
                        <tr className={index % 2 == 0 ? 'evenrow' : 'oddrow'} key={index}>
                            <td>{Utils.formatPhone(record.phone)}</td>
                            <td>{Utils.formatTimestamp(record.created_at)}</td>
                        </tr>
                    ))
                }
            </tbody>
        </RecordHistoryTableStyled>
    )
}