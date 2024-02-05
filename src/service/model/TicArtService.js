import axios from 'axios';
import env from '../../configs/env';
import Token from '../../utilities/Token';

export class TicArtService {
    async getLista(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en';
        const url = `${env.TIC_BACK_URL}/tic/x/art/_v/lista/?stm=tic_art_v&sl=${selectedLanguage}`;
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

    async getEventLista(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en';
        const url = `${env.TIC_BACK_URL}/tic/x/art/_v/lista/?stm=tic_eventart_v&objid=${objId}&sl=${selectedLanguage}`;
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

    async getTicArts() {
        const selectedLanguage = localStorage.getItem('sl') || 'en';
        const url = `${env.TIC_BACK_URL}/tic/x/art/?sl=${selectedLanguage}`;
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

    async getTicArt(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en';
        const url = `${env.TIC_BACK_URL}/tic/x/art/${objId}/?sl=${selectedLanguage}`;
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

    async postTicArt(newObj) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en';
            if (newObj.code.trim() === '' || newObj.text.trim() === '' || newObj.valid === null) {
                throw new Error('Items must be filled!');
            }
            const url = `${env.TIC_BACK_URL}/tic/x/art/?sl=${selectedLanguage}`;
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

    async putTicArt(newObj) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en';
            if (newObj.code.trim() === '' || newObj.text.trim() === '' || newObj.valid === null) {
                throw new Error('Items must be filled!');
            }
            const url = `${env.TIC_BACK_URL}/tic/x/art/?sl=${selectedLanguage}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Content-Type': 'application/json',
                Authorization: tokenLocal.token
            };
            const jsonObj = JSON.stringify(newObj);
            const response = await axios.put(url, jsonObj, { headers });
            //console.log("**************"  , response, "****************")
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deleteTicArt(newObj) {
        try {
            const url = `${env.TIC_BACK_URL}/tic/x/art/${newObj.id}`;
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
