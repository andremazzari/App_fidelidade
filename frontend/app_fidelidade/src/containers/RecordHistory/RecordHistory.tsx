'use client'
//external dependencies
import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";

//internal dependencies
import RecordHistoryTable, { RecordHistoryTableProps } from "../../components/tables/RecordHistoryTable/RecordHistoryTable";
import { RecordHistoryContainer, RecordHistoryHeaderForm, PaginationForm } from "./styled";
import RecordHistoryRequests from "@/services/RecordHistoryRequests";
import Utils from "@/utils/Utils";
import HistoryOptionsButton from "@/components/buttons/HistoryOptions/HistoryOptions";
import RedeemHistoryTable from "@/components/tables/RedeemHistoryTable/RedeemHistoryTable";

//TEMP: unify RecordHistoryTableProps interface to include the Redeem Props too
interface RecordHistoryProps extends RecordHistoryTableProps {
    initialPageNumber: number
    initialTotalPages: number
}

export default function RecordHistory({initialData, initialPageNumber, initialTotalPages}: RecordHistoryProps) {
    const [isRecordHistorySelected, setIsRecordHistorySelected] = useState(true);

    const [tableData, setTableData] = useState(initialData);
    const [totalPages, setTotalPages] = useState(initialTotalPages);

    const [updateDataTrigger, setUpdateDataTrigger] = useState(0);

    const [isPhoneFilterEnabled, setIsPhoneFilterEnabled] = useState(false);
    const [currentPhone, setCurrentPhone] = useState<number | undefined>(undefined);
    const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
    const [unformattedPhoneNumber, setUnformattedPhoneNumber] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState({error: false, message: ''})

    const [isDateFilterEnabled, setIsDateFilterEnabled] = useState(false);
    const [currentInitialDate, setCurrentInitialDate] = useState<string | undefined>(undefined);
    const [currentEndDate, setCurrentEndDate] = useState<string | undefined>(undefined);
    const [initialDateFilter, setInitialDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');
    const [datesError, setDatesError] = useState({error: false, message: ''});

    const [isRedeemedFilterEnabled, setIsRedeemedFilterEnabled] = useState(false);
    const [isCanceledFilterEnabled, setIsCanceledFilterEnable] = useState(false);

    const [pageNumber, setPageNumber] = useState(initialPageNumber);

    const isMounted = useRef(false);

    //TEMP: review the page size
    const pageSize = 10;

    useEffect(() => {
        async function fecthData() {
            //TEMP: for now, set page size to fixed value of 10
            let phone: number | undefined = undefined;
            let initialDate: string | undefined = undefined;
            let endDate: string | undefined = undefined;
            let phoneValidated = true;
            let datesValidated = true;

            if (isPhoneFilterEnabled) {
                phoneValidated = validatePhone();
                phone = parseInt(unformattedPhoneNumber);
            }

            if (isDateFilterEnabled) {
                datesValidated = validateDates();
                initialDate = initialDateFilter
                endDate = endDateFilter;
            }

            if (phoneValidated && datesValidated) {
                let page: number;
                if (phone != currentPhone || initialDate != currentInitialDate || endDate != currentEndDate) {
                    setPageNumber(1);
                    page = 1;
                } else {
                    page = pageNumber
                }

                let response;
                if (isRecordHistorySelected) {
                    response = await RecordHistoryRequests.getRecords(page, pageSize, phone, initialDate, endDate, isRedeemedFilterEnabled, isCanceledFilterEnabled);
                } else {
                    response = await RecordHistoryRequests.getRedeemRecords(page, pageSize, phone, initialDate, endDate);
                }
                
                if (response.status != 200) {
                    //TEMP: print error message in page
                    console.log('Erro para ler dados do historico!');
                }
                
                setTableData(response.data.records);
                setTotalPages(response.data.pages);

                if (isPhoneFilterEnabled) {
                    setCurrentPhone(phone);
                } else {
                    setCurrentPhone(undefined);
                }

                if (isDateFilterEnabled) {
                    setCurrentInitialDate(initialDate);
                    setCurrentEndDate(endDate);
                } else {
                    setCurrentInitialDate(undefined);
                    setCurrentEndDate(undefined);
                }
            }
            
        }

        if (updateDataTrigger > 0) {
            fecthData();
        }
    }, [updateDataTrigger]);

    useEffect(() => {
        async function fetchData() {
            let response;
            if (isRecordHistorySelected) {
                response = await RecordHistoryRequests.getRecords(pageNumber, pageSize, currentPhone, currentInitialDate, currentEndDate, isCanceledFilterEnabled);
            } else {
                response = await RecordHistoryRequests.getRedeemRecords(pageNumber, pageSize, currentPhone, currentInitialDate, currentEndDate);
            }
            
            if (response.status != 200) {
                //TEMP: print error message in page
                console.log('Erro para ler dados do historico!');
            }

            setTableData(response.data.records);
            setTotalPages(response.data.pages);
        }

        if (isMounted.current) {
            fetchData();
        }
    }, [isRecordHistorySelected]);

    useEffect(() => {
        isMounted.current = true;
    }, []);

    function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setUpdateDataTrigger(updateDataTrigger + 1);
    }

    function enablePhoneFilter(event: ChangeEvent<HTMLInputElement>) {
        setIsPhoneFilterEnabled(event.target.checked);
        setPhoneNumberError({error: false, message: ''});
    }

    function enableDateFilter(event: ChangeEvent<HTMLInputElement>) {
        setIsDateFilterEnabled(event.target.checked);
        setDatesError({error: false, message: ''});
    }

    function validatePhone() {
        const phoneRegex = /^\d+$/;
        if (!phoneRegex.test(unformattedPhoneNumber)) {
            setPhoneNumberError({error: true, message: 'Telefone inválido.'});
            return false;
        }

        if (unformattedPhoneNumber.length != 10 && unformattedPhoneNumber.length != 11) {
            setPhoneNumberError({error: true, message: 'Telefone inválido.'});
            return false;
        }

        setPhoneNumberError({error: false, message: ''});
        return true;
    }

    function validateDates() {
        if (initialDateFilter == '' && endDateFilter == '') {
            setDatesError({error: true, message: 'Selecione as datas.'});
            return false;
        }

        if ((initialDateFilter != '' && endDateFilter == '') || (initialDateFilter == '' && endDateFilter != '')) {
            setDatesError({error: true, message: 'Ambas as datas devem ser selecionadas.'});
            return false;
        }

        const initialDate = new Date(initialDateFilter);
        const endDate = new Date(endDateFilter);

        if (endDate < initialDate) {
            setDatesError({error: true, message: 'Data final não pode ser menor que data inicial.'});
            return false;
        }

        setDatesError({error: false, message: ''});
        return true;
    }
    
    async function handlePageNumberChange(event: ChangeEvent<HTMLSelectElement>) {
        const page = parseInt(event.target.value);

        const response = await RecordHistoryRequests.getRecords(page, pageSize, currentPhone, currentInitialDate, currentEndDate);
        
        if (response.status != 200) {
            //TEMP: print error message in page
            console.log('Erro para ler dados do historico!');
        }
        
        setTableData(response.data.records);
        setTotalPages(response.data.pages);
        setPageNumber(page);
    }

    return (
        <RecordHistoryContainer>
            <HistoryOptionsButton option1Name="Registros" option2Name="Resgates" optionSetter={setIsRecordHistorySelected}/>
            <RecordHistoryHeaderForm onSubmit={(event) => handleFormSubmit(event)}>
                <div className="RecordHistoryFilters">
                    <div>
                        <input type='checkbox' checked={isPhoneFilterEnabled} onChange={(e) => enablePhoneFilter(e)}/>
                        <label htmlFor="formattedPhone">
                            Filtrar por telefone: 
                        </label>
                        +55 <input type="tel" id='formattedPhone' name='formattedPhone' disabled={!isPhoneFilterEnabled} value={formattedPhoneNumber} onChange={(event) => Utils.handlePhoneNumberChange(event, setUnformattedPhoneNumber, setFormattedPhoneNumber)}/>
                        {phoneNumberError.error ? <span style={{color:'red'}}>{phoneNumberError.message}</span> : ''}
                        <input type='hidden' name='phone' value={unformattedPhoneNumber}/>
                    </div>

                    <div>
                    <input type='checkbox' checked={isDateFilterEnabled} onChange={(e) => enableDateFilter(e)}/>
                        <label>
                            Filtrar por data: 
                        </label>
                        <input type="date" id='initialDate' name='initialDate' disabled={!isDateFilterEnabled} value={initialDateFilter} onChange={(event) => setInitialDateFilter(event.target.value)}/>
                        até
                        <input type="date" id='endDate' name='endDate' disabled={!isDateFilterEnabled} value={endDateFilter} onChange={(event) => setEndDateFilter(event.target.value)}/>
                        {datesError.error ? <span style={{color:'red'}}>{datesError.message}</span> : ''}
                    </div>

                    <div>
                    <input type='checkbox' name='excludeRedeemed' checked={isRedeemedFilterEnabled} onChange={(e) => setIsRedeemedFilterEnabled(e.target.checked)}/>
                    Excluir pontos resgatados.
                    </div>
                    
                    <div>
                    <input type='checkbox' name='includeCanceled' checked={isCanceledFilterEnabled} onChange={(e) => setIsCanceledFilterEnable(e.target.checked)}/>
                    Incluir pontos cancelados.
                    </div>
                </div>

                <button type='submit'>Atualizar</button>
            </RecordHistoryHeaderForm>

            <PaginationForm>
                Pagina:
                <select value={pageNumber} onChange={(event) => handlePageNumberChange(event)}>
                    {[...Array(totalPages)].map((_, index) => (
                    <option key={index + 1} value={index + 1}>{index + 1}</option>
                    ))}
                </select>
            </PaginationForm>
            
            {
                isRecordHistorySelected ? <RecordHistoryTable initialData={tableData} includeRedeemInfo={true}/> : <RedeemHistoryTable initialData={tableData}/>
            }
            

        </RecordHistoryContainer>
    )
}