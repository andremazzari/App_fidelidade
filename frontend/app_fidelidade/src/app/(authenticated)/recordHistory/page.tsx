//internal dependencies
import { PageContainer } from "./styled";
import RecordHistory from "@/containers/RecordHistory/RecordHistory";
import RecordHistoryRequests from "@/services/RecordHistoryRequests";

export default async function Page() {
    //fetch initial data
    const initialPageNumber = 1;
    const initialPageSize = 10;

    const response = await RecordHistoryRequests.getRecords(initialPageNumber, initialPageSize);
    if (response.status != 200) {
        //TEMP: print error message in page
        console.log('Erro para ler dados do historico!');
    }
    
    return (
        <PageContainer>
            <RecordHistory initialData={response.data.records} initialPageNumber={initialPageNumber} initialTotalPages={response.data.pages}/>
        </PageContainer>
    )
}