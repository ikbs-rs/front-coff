import axios from 'axios';
import env from '../../configs/env';
import Token from '../../utilities/Token';

export class TicEventstService {
    async getLista(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en';
        const url = `${env.TIC_BACK_URL}/tic/x/art/_v/lista/?stm=tic_eventst_v&sl=${selectedLanguage}`;
        const tokenLocal = await Token.getTokensLS();
        const headers = {
            Authorization: tokenLocal.token
        };

        try {
            const response = await axios.get(url, { headers });
            return response.data.item;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

}
