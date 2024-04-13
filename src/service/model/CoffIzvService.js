import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

export class CoffIzvService {
  async getLista(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.COFF_BACK_URL}/coff/doc/_v/lista/?stm=coff_doc_v&sl=${selectedLanguage}`;
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

  async getIzv01(objId, objName, par1, par2, par3, par4, lang) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.COFF_BACK_URL}/coff/izv/_v/lista/?stm=coff_izv01_v&objid=${objId}&objName=${objName}&par1=${par1}&par2=${par2}&sl=${selectedLanguage}`
    console.log(url, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@############################")
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      console.log(response, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ response @@@@@@@@@@@@@@@@@@@@@@@@@############################")
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getIzv01stanje(objId, objName, par1, par2, par3, par4, lang) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.COFF_BACK_URL}/coff/izv/_v/lista/?stm=coff_izv01stanje_v&objid=${objId}&objName=${objName}&par1=${par1}&par2=${par2}&sl=${selectedLanguage}`
    console.log(url, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@############################")
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      console.log(response, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ response @@@@@@@@@@@@@@@@@@@@@@@@@############################")
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getIzv01kartica(objId, objName, par1, par2, par3, par4, lang) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.COFF_BACK_URL}/coff/izv/_v/lista/?stm=coff_izv01kartica_v&objid=${objId}&objName=${objName}&par1=${par1}&par2=${par2}&sl=${selectedLanguage}`
    console.log(url, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@############################")
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      console.log(response, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ response @@@@@@@@@@@@@@@@@@@@@@@@@############################")
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async postCoffIzv(newObj) {
    try {

      const selectedLanguage = localStorage.getItem('sl') || 'en'
      newObj.usr = localStorage.getItem('userId') 

      if (newObj.mesto.trim() === '' || newObj.potpisnik === null) {
        throw new Error(
          "Items must be filled!"
        );
      }

      const url = `${env.COFF_BACK_URL}/coff/doc/?sl=${selectedLanguage}`;
      // console.log("**URL************"  , url, "****************", newObj.usr)
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)
      const response = await axios.post(url, jsonObj, { headers });
      // console.log("**************"  , response.data, "****************")
      localStorage.setItem('currCoffOrder', response.data.items);
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

}

