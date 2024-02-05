import axios from 'axios';
import env from "../../../configs/env"
import Token from "../../../utilities/Token";

export class CmnLocService {

  async getLista() {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.CMN_BACK_URL}/cmn/x/loc/_v/lista/?stm=cmn_loc_v&sl=${selectedLanguage}`;
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

  async getListaLL(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.CMN_BACK_URL}/cmn/x/loc/_v/lista/?stm=cmn_locll_v&objid=${objId}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      console.log(url, "*****************getListaLL******************", response.data)
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getObjTree() {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.CMN_BACK_URL}/cmn/x/loc/_v/lista/?stm=cmn_loctree_json_v&sl=${selectedLanguage}`;
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

  async getCmnLoc(locId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.CMN_BACK_URL}/cmn/x/loc/${locId}/?sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      console.log(response.data.items||response.data.item, "*****************getCmnLoc!!!!!!@@@@@@*****************", url)
      return response.data.items||response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


  async postCmnLoc(newObj) {
    try {
      console.log(newObj, "***************postCmnLoc***************")
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      if (newObj.text.trim() === '' || newObj.valid === null) {
        throw new Error(
          "Items must be filled!"
        );
      }
      const url = `${env.CMN_BACK_URL}/cmn/x/loc/?sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)
      console.log(newObj, "**************"  , jsonObj, "****************")
      const response = await axios.post(url, jsonObj, { headers });
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async putCmnLoc(newObj) {
    try {
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      if (newObj.code.trim() === '' || newObj.text.trim() === '' || newObj.valid === null) {
        throw new Error(
          "Items must be filled!"
        );
      }
      const url = `${env.CMN_BACK_URL}/cmn/x/loc/?sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)
      console.log(newObj, "**************"  , jsonObj, "****************")
      const response = await axios.put(url, jsonObj, { headers });
      //console.log("**************"  , response, "****************")
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async deleteCmnLoc(newObj) {
    try {
      const url = `${env.CMN_BACK_URL}/cmn/x/loc/${newObj.id}`;
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

