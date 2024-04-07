import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

export class CoffSastavnicaService {

    async getLista(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.COFF_BACK_URL}/coff/sastavnica/_v/lista/?stm=coff_sastavnica_v&objid=${objId}&sl=${selectedLanguage}`;
        const tokenLocal = await Token.getTokensLS();
        const headers = {
          Authorization: tokenLocal.token
        };
        try {
          const response = await axios.get(url, { headers });
          //console.log(url, "**********************************", response.data.item)
          return response.data.item;
        } catch (error) {
          console.error(error);
          throw error;
        }
      }

      async getCmnLocs() {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.CMN_BACK_URL}/cmn/x/loc/?sl=${selectedLanguage}`;
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

    async getCoffSastavnicas() {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.COFF_BACK_URL}/coff/sastavnica/?sl=${selectedLanguage}`;
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

    async getCoffSastavnica(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.COFF_BACK_URL}/coff/sastavnica/${objId}/?sl=${selectedLanguage}`;
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


    async postCoffSastavnica(newObj) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            if (newObj.action === null || newObj.roll === null) {
                throw new Error(
                    "Items must be filled!"
                );
            }
            const url = `${env.COFF_BACK_URL}/coff/sastavnica/?sl=${selectedLanguage}`;
            const tokenLocal = await Token.getTokensLS();
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': tokenLocal.token
            };
            const jsonObj = JSON.stringify(newObj)
            const response = await axios.post(url, jsonObj, { headers });
            return response.data.items;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async putCoffSastavnica(newObj) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            if (newObj.action === null || newObj.roll === null)  {
                throw new Error(
                    "Items must be filled!"
                );
            }
            const url = `${env.COFF_BACK_URL}/coff/sastavnica/?sl=${selectedLanguage}`;
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

    async deleteCoffSastavnica(newObj) {
        try {
            const url = `${env.COFF_BACK_URL}/coff/sastavnica/${newObj.id}`;
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
   
}

