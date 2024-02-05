import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

export class TicParprivilegeService {

    async getLista(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.TIC_BACK_URL}/tic/parprivilege/_v/lista/?stm=tic_parprivilege_v&objid=${objId}&sl=${selectedLanguage}`;
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

    async getTicParprivileges() {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.TIC_BACK_URL}/tic/parprivilege/?sl=${selectedLanguage}`;
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

    async getTicParprivilege(objId) {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.TIC_BACK_URL}/tic/parprivilege/${objId}/?sl=${selectedLanguage}`;
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


    async postTicParprivilege(newObj) {
        try {
            
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            if (newObj.action === null || newObj.roll === null) {
                throw new Error(
                    "Items must be filled!"
                );
            }
            const url = `${env.TIC_BACK_URL}/tic/parprivilege/?sl=${selectedLanguage}`;

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

    async putTicParprivilege(newObj) {
        try {
            const selectedLanguage = localStorage.getItem('sl') || 'en'
            if (newObj.action === null || newObj.roll === null)  {
                throw new Error(
                    "Items must be filled!"
                );
            }
            const url = `${env.TIC_BACK_URL}/tic/parprivilege/?sl=${selectedLanguage}`;
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

    async deleteTicParprivilege(newObj) {
        try {
            const url = `${env.TIC_BACK_URL}/tic/parprivilege/${newObj.id}`;
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


    async getTicPrivileges() {
        const selectedLanguage = localStorage.getItem('sl') || 'en'
        const url = `${env.TIC_BACK_URL}/tic/x/privilege/?sl=${selectedLanguage}`;
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

}

