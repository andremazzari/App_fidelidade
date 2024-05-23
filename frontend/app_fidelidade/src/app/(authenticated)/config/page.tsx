//internal dependencies
import { PageContainer } from "./styled";
import FidelityConfig from "@/containers/FidelityConfig/FidelityConfig";
import RequestsUtils, {sendProps} from "@/utils/RequestUtils";

export default async function Page() {
    const options: sendProps = {
        method: 'GET',
        url: `${process.env.NEXT_PUBLIC_BACKEND_SERVER_ADDRESS as string}/fidelityConfig`,
        contentType: 'form-urlencoded',
        cache: 'no-store',
        setAuthHeader: true
    }

    const response = await RequestsUtils.send(options);

    if (response.status != 200) {
        //TEMP: handle this error
        console.log('Erro ao ler valor inicial do target')
    }

    return (
        <PageContainer>
            <FidelityConfig initialTarget={response.data.target}/>
        </PageContainer>
    )
}