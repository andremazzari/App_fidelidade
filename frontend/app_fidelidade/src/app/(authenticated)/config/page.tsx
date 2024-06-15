//internal dependencies
import { PageContainer } from "./styled";
import FidelityConfig, {configFields} from "@/containers/FidelityConfig/FidelityConfig";
import RequestsUtils, {sendProps} from "@/utils/RequestUtils";
import FacebookLogin from "@/components/buttons/FacebookLogin/FacebookLogin";
import SearchWhatsappTemplates from "@/containers/Whatsapp/SearchTemplates/SearchWhatsappTemplate";

export default async function Page() {
    const options: sendProps = {
        method: 'GET',
        url: `${process.env.NEXT_PUBLIC_BACKEND_SERVER_ADDRESS as string}/fidelity/config`,
        contentType: 'form-urlencoded',
        cache: 'no-store',
        setAuthHeader: true
    }

    const response = await RequestsUtils.send(options);

    if (response.status != 200) {
        //TEMP: handle this error
        console.log('Erro ao ler valor inicial do target')
    }

    const config: configFields ={
        target: response.data.target,
        whatsappMessageEnabled: response.data.whatsapp_message_enabled
    }

    return (
        <>
            <PageContainer>
                <FidelityConfig config={config}/>
                <FacebookLogin/>
                <SearchWhatsappTemplates/>
            </PageContainer>
        </>
    )
}