//external dependencies
import { revalidateTag } from "next/cache";

//internal dependencies
import { RegisterPageContainer, FormContainer } from "./styled";
import FidelityForm from "@/components/forms/FidelityForm/FidelityForm";
import RecordHistoryTable from "@/components/tables/RecordHistoryTable/RecordHistoryTable";
import RecordHistoryRequests from "@/services/RecordHistoryRequests";

export default async function Page() {
    //On page reload, revalidate history data
    revalidateTag('registerPageRecordHistory');

    //fetch initial data
    const PageNumber = 1;
    const PageSize = 5;

    const response = await RecordHistoryRequests.getRecords(PageNumber, PageSize, undefined, undefined, undefined, undefined, undefined, 'registerPageRecordHistory');
    if (response.status != 200) {
        //TEMP: print error message in page
        console.log('Erro para ler dados do historico!');
    }

    return (
        <RegisterPageContainer>
            <FormContainer>
                <FidelityForm/>
            </FormContainer> 

            <div>
                <p>Últimos registros:</p>
                <RecordHistoryTable initialData={response.data.records} includeRedeemInfo={false}/>
            </div>
        </RegisterPageContainer>
    )
}