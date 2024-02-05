import axios from 'axios';
import env from '../../configs/env';
import Token from '../../utilities/Token';

export class TicEventattService {

    async getLista(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.TIC_BACK_URL}/tic/x/eventatt/_v/lista/?stm=tic_eventatt_v&sl=${selectedLanguage}`;
        const tokenLocal = await Token.getTokensLS();
        const headers = {
            Authorization: tokenLocal.token
        };

        try {
            console.log("**********TicDocService*************",url)
            const response = await axios.get(url, { headers });
            return response.data.item;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getTicEventatts() {
        const selectedLanguage = localStorage.getItem('sl') || 'en';
        const url = `${env.TIC_BACK_URL}/tic/x/eventatt/?sl=${selectedLanguage}`;
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

    async getTicEventatt(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en';
        const url = `${env.TIC_BACK_URL}/tic/x/eventatt/${objId}/?sl=${selectedLanguage}`;
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

    async postTicEventatt(newObj) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en';
            if (newObj.code.trim() === '' || newObj.text.trim() === '' || newObj.valid === null) {
                throw new Error('Items must be filled!');
            }
            const url = `${env.TIC_BACK_URL}/tic/x/eventatt/?sl=${selectedLanguage}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Content-Type': 'application/json',
                Authorization: tokenLocal.token
            };
            const jsonObj = JSON.stringify(newObj);
            const response = await axios.post(url, jsonObj, { headers });
            console.log("**************"  , jsonObj, "****************")
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async putTicEventatt(newObj) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en';
            if (newObj.code.trim() === '' || newObj.text.trim() === '' || newObj.valid === null) {
                throw new Error('Items must be filled!');
            }
            const url = `${env.TIC_BACK_URL}/tic/x/eventatt/?sl=${selectedLanguage}`;
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

    async deleteTicEventatt(newObj) {
        try {
            const url = `${env.TIC_BACK_URL}/tic/x/eventatt/${newObj.id}`;
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

    async getCmnInputtps() {
        const selectedLanguage = localStorage.getItem('sl') || 'en';
        const url = `${env.CMN_BACK_URL}/cmn/x/inputtp/?sl=${selectedLanguage}`;
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

    async getCmnObjs(objid) {
        const selectedLanguage = localStorage.getItem('sl') || 'en';
        const url = `${env.CMN_BACK_URL}/cmn/x/obj/_v/lista/?stm=cmn_objsett_v&objid=${objid}&sl=${selectedLanguage}`;
        // http://192.168.72.96/bcmn/cmn/x/obj/_v/lista/?stm=cmn_objsett_v&objid=XPK&sl=sr_cyr
        const tokenLocal = await Token.getTokensLS();
        const headers = {
            Authorization: tokenLocal.token
        };

        try {
            
            const response = await axios.get(url, { headers });
            console.log(url,"/*/*/*/*/*/*/*/*/*/*url/*/*/*/*/*/*/*/*/*/*/*/*/*/**/",  response.data.item)
            return response.data.items||response.data.item;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }    
}
