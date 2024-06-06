//internal dependencies
import Modal from "../Modal";
import Utils from "@/utils/Utils";
import { CancelRecordModalContent } from "./styled";
import RecordHistoryRequests from "@/services/RecordHistoryRequests";

interface CancelRecordModalProps {
    isModalOpen: boolean
    onClose: () => void
    phone: number
    timestamp: string
    setIsRecordCanceled: React.Dispatch<React.SetStateAction<boolean>>
    setCanceledTimestamp: React.Dispatch<React.SetStateAction<string | undefined>>
}
export default function CancelRecordModal({isModalOpen, onClose, phone, timestamp, setIsRecordCanceled, setCanceledTimestamp}: CancelRecordModalProps) {
    async function handleRecordCancelation() {
        
        const result = await RecordHistoryRequests.deleteFidelityRecord(phone, timestamp);

        if (result.status != 200) {
            //TEMP: How should I treat this error ? Print some message in the modal ?
            console.log('Erro ao cancelar registro');
        }

        setIsRecordCanceled(true);
        setCanceledTimestamp(result.data.canceled_at);

        onClose();
    }

    return (
        <Modal isModalOpen={isModalOpen} onClose={onClose}>
            <CancelRecordModalContent>
                <p>
                Cancelar o registro do telefone <b>{Utils.formatPhone(phone)}</b> realizado no dia <b>{Utils.formatTimestamp(timestamp)}</b> ?
                </p>
                <div className="buttons-container">
                    <button className="modal-button cancel-button" onClick={() => handleRecordCancelation()}>Confirmar</button>
                    <button className="modal-button" onClick={onClose}>Retornar</button>
                </div>
            </CancelRecordModalContent>
        </Modal>
    )
}