import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

export class CoffZapService {


  async getListObjaLL(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.CMN_BACK_URL}/cmn/x/obj/_v/lista/?stm=cmn_objll_v&objid=${objId}&sl=${selectedLanguage}`;
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

  async getLista(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.COFF_BACK_URL}/coff/zap/_v/lista/?stm=coff_zap_v&objid=${objId}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      console.log("KKKKKKK", url, response)
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getCoffZaps() {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.COFF_BACK_URL}/coff/zap/?sl=${selectedLanguage}`;
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

  async getCoffZapsTp(doctp) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.COFF_BACK_URL}/coff/zap/_v/lista/?stm=coff_docstp_v&objid=${doctp}&sl=${selectedLanguage}`
    console.log(url, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@############################")
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

  async getCoffZap(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.COFF_BACK_URL}/coff/zap/${objId}/?sl=${selectedLanguage}`;
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


  async postCoffZap(newObj) {
    try {
      newObj.tp=1
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      if (newObj.zap.trim() === '' || newObj.oblast.trim() === '') {
        throw new Error(
          "Items must be filled!"
        );
      }
      const url = `${env.COFF_BACK_URL}/coff/zap/?sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)
      const response = await axios.post(url, jsonObj, { headers });
      //console.log("**************"  , response, "****************")
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async putCoffZap(newObj) {
    try {
      newObj.tp=1
      console.log("putCoffZap**************newObj ", newObj)
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      // if (newObj?.zap.trim() === '' || newObj?.oblast.trim() === '') {
      //   throw new Error(
      //     "Items must be filled!"
      //   );
      // }
      const url = `${env.COFF_BACK_URL}/coff/zap/?sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)
      console.log("putCoffZap**************"  , jsonObj, "****************", url)
      const response = await axios.put(url, jsonObj, { headers });
      console.log("putCoffZap **************"  , response, "****************")
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async deleteCoffZap(newObj) {
    try {
      const url = `${env.COFF_BACK_URL}/coff/zap/${newObj.id}`;
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

  async getMenu(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.COFF_BACK_URL}/coff/zap/_v/lista/?stm=coff_menu_v&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      console.log("------------------ getMenu ---------------------------------", url)
      const response = await axios.get(url, { headers });
      console.log("KKKKKKK getMenu ---------------------------------", url, response.data)
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

}

