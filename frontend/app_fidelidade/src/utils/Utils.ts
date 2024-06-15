//external dependencies
import { ChangeEvent } from "react";

class Utils {
    static formatPhone(unformattedPhone: number) {
        let formattedPhone = unformattedPhone.toString();
        if (formattedPhone.length == 10) {
            formattedPhone = `(${formattedPhone.substring(0,2)}) ${formattedPhone.substring(2,6)}-${formattedPhone.substring(6,10)}`
        } else if (formattedPhone.length == 11) {
            formattedPhone = `(${formattedPhone.substring(0,2)}) ${formattedPhone.substring(2,7)}-${formattedPhone.substring(7,11)}`
        }
        
        return formattedPhone;
    }

    static formatTimestamp(unformattedTimestamp: string) {
        //TEMP: update this to use the moment-timezone library
        const timestamp = new Date(unformattedTimestamp);

        const year = timestamp.getFullYear().toString().slice(-2); // Get last two digits of the year
        const month = ("0" + (timestamp.getMonth() + 1)).slice(-2); // Add leading zero if needed
        const day = ("0" + timestamp.getDate()).slice(-2); // Add leading zero if needed
        const hour = ("0" + timestamp.getHours()).slice(-2); // Add leading zero if needed
        const minutes = ("0" + timestamp.getMinutes()).slice(-2); // Add leading zero if needed
        const seconds = ("0" + timestamp.getSeconds()).slice(-2); // Add leading zero if needed


        const formattedTimestamp = `${day}/${month}/${year} às ${hour}:${minutes}:${seconds}`;
        return formattedTimestamp;
    }

    static formatTimestampToMySQL(unformattedTimestamp: string) {
        //TEMP: update this to use the moment-timezone library
        // Parse the input timestamp to a Date object
        const date = new Date(unformattedTimestamp);
        
        // Extract the individual components
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

        // Format the milliseconds to one decimal place
        const formattedMilliseconds = milliseconds.substring(0, 1);

        // Construct the final formatted string
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${formattedMilliseconds}`;
    }

    static handlePhoneNumberChange(event: ChangeEvent<HTMLInputElement>, setUnformattedPhoneNumber: React.Dispatch<React.SetStateAction<string>>, setFormattedPhoneNumber: React.Dispatch<React.SetStateAction<string>>): void {
        const inputPhoneNumber = event.target.value;

        // Remove non-digit characters to get the unformatted phone number
        const unformattedNumber = inputPhoneNumber.replace(/\D/g, '');

        if (unformattedNumber.length > 11) {
            return
        }

        setUnformattedPhoneNumber(unformattedNumber);
        
        // Format the phone number with DDD
        let formattedNumber = '';
        if (unformattedNumber.length <= 2 && unformattedNumber.length > 0) {
            formattedNumber = `(${unformattedNumber.substring(0, 2)}`;
        }
        else if (unformattedNumber.length > 2 && unformattedNumber.length <= 6) {
            formattedNumber = `(${unformattedNumber.substring(0, 2)}) ${unformattedNumber.substring(2)}`;
        }
        else if (unformattedNumber.length > 6 && unformattedNumber.length < 11) {
            formattedNumber = `(${unformattedNumber.substring(0, 2)}) ${unformattedNumber.substring(2, 6)}-${unformattedNumber.substring(6, 11)}`;
        } else if (unformattedNumber.length >= 11) {
            formattedNumber = `(${unformattedNumber.substring(0, 2)}) ${unformattedNumber.substring(2, 7)}-${unformattedNumber.substring(7, 11)}`;
        }
        
        setFormattedPhoneNumber(formattedNumber);
    };
}

export default Utils