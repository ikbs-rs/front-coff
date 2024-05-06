import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

export class CoffZaplinkService {

    async getLista(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.COFF_BACK_URL}/coff/zaplink/_v/lista/?stm=coff_zaplink_v&objid=${objId}&sl=${selectedLanguage}`;
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

    async getZapByUser(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.COFF_BACK_URL}/coff/zaplink/_v/lista/?stm=coff_zapbyuser_v&objid=${objId}&sl=${selectedLanguage}`;
        const tokenLocal = await Token.getTokensLS();
        const headers = {
            Authorization: tokenLocal.token
        };

        try {
            const response = await axios.get(url, { headers });
            return response.data.item||response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getListaLL(objId, locCode) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.COFF_BACK_URL}/coff/zaplink/_v/fkey/?stm=coff_zaplinkll_v&item=${locCode}&id=${objId}&sl=${selectedLanguage}`;
        const tokenLocal = await Token.getTokensLS();
        const headers = {
            Authorization: tokenLocal.token
        };

        try {
            const response = await axios.get(url, { headers });
            console.log(url, "******************************getListaLL*********************************", response.data.item)
            return response.data.item;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getCoffZaplinks() {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.COFF_BACK_URL}/coff/zaplink/?sl=${selectedLanguage}`;
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

    async getCoffZaplink(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.COFF_BACK_URL}/coff/zaplink/${objId}/?sl=${selectedLanguage}`;
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


    async postCoffZaplink(newObj) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            if (newObj.obj === null || newObj.objtp === null) {
                throw new Error(
                    "Items must be filled!"
                );
            }
            const url = `${env.COFF_BACK_URL}/coff/zaplink/?sl=${selectedLanguage}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': tokenLocal.token
            };
            const jsonObj = JSON.stringify(newObj)
            console.log(newObj, "--------jsonObj---------", url)
            const response = await axios.post(url, jsonObj, { headers });
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async putCoffZaplink(newObj) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            if (newObj.obj === null || newObj.objtp === null) {
                throw new Error(
                    "Items must be filled!"
                );
            }
            const url = `${env.COFF_BACK_URL}/coff/zaplink/?sl=${selectedLanguage}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': tokenLocal.token
            };
            const jsonObj = JSON.stringify(newObj)
            const response = await axios.put(url, jsonObj, { headers });
            //console.log("**************"  , response, "****************")
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }

    }

    async deleteCoffZaplink(newObj) {
        try {
            const url = `${env.COFF_BACK_URL}/coff/zaplink/${newObj.id}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Authorization': tokenLocal.token
            };

            const response = await axios.delete(url, { headers });
            return response.data.items;
        } catch (error) {
            throw error;
        }

    }


    async postGrpLoclink(obj,newObj, addItems, begda, enda) {
        try {
            console.log(addItems, "********************    ***postGrpEventattsk9999999999")
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            if (obj.id===null) {
                throw new Error(
                    "obj must be filled!"
                );
            }
            const url = `${env.COFF_BACK_URL}/coff/zaplink/_s/param/?stm=cmn_grploclink_s&table=${JSON.stringify(obj)}&par1=${addItems}&begda=${begda}&endda=${enda}&sl=${selectedLanguage}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': tokenLocal.token
            };
            const jsonObj = JSON.stringify(newObj)
            
            const response = await axios.post(url, {jsonObj}, { headers });
            console.log(response.data, "***************************postGrpEventatts*******************************", url)
            return response.data.item;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

}

