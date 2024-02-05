import axios from 'axios';
import env from '../../configs/env';
import Token from '../../utilities/Token';

export class TicEventartService {

    async getLista(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en';
        const url = `${env.TIC_BACK_URL}/tic/eventart/_v/lista/?stm=tic_eventart_v&objid=${objId}&sl=${selectedLanguage}`;
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

    async getTicEventarts() {
        const selectedLanguage = localStorage.getItem('sl') || 'en';
        const url = `${env.TIC_BACK_URL}/tic/x/eventart/?sl=${selectedLanguage}`;
        const tokenLocal = await Token.getTokensLS();
        const headers = {
            Authorization: tokenLocal.token
        };

        try {
            const response = await axios.get(url, { headers });
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getTicEventart(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en';
        const url = `${env.TIC_BACK_URL}/tic/x/eventart/${objId}/?sl=${selectedLanguage}`;
        const tokenLocal = await Token.getTokensLS();
        const headers = {
            Authorization: tokenLocal.token
        };

        try {
            const response = await axios.get(url, { headers });
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async postTicEventart(newObj) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en';
            if (newObj.art  === null || newObj.discount  === null) {
                throw new Error('Items must be filled!');
            }
            const url = `${env.TIC_BACK_URL}/tic/eventart/?sl=${selectedLanguage}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Content-Type': 'application/json',
                Authorization: tokenLocal.token
            };
            const jsonObj = JSON.stringify(newObj);
            const response = await axios.post(url, jsonObj, { headers });
            //console.log("**************"  , response, "****************")
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async putTicEventart(newObj) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en';
            if (newObj.art  === null || newObj.discount  === null)  {
                throw new Error('Items must be filled!');
            }
            const url = `${env.TIC_BACK_URL}/tic/eventart/?sl=${selectedLanguage}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Content-Type': 'application/json',
                Authorization: tokenLocal.token
            };
            const jsonObj = JSON.stringify(newObj);
            const response = await axios.put(url, jsonObj, { headers });
            
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deleteTicEventart(newObj) {
        try {
            const url = `${env.TIC_BACK_URL}/tic/eventart/${newObj.id}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                Authorization: tokenLocal.token
            };

            const response = await axios.delete(url, { headers });
            return response.data.items;
        } catch (error) {
            throw error;
        }
    }
}
