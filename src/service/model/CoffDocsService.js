import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

export class CoffDocsService {

  // Vraca varijante jedinice mera za unos kolicine KOM/FLASA
  async getDocsorder(objId, id) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    // const currCoffOrder = localStorage.getItem('currCoffOrder')
    const url = `${env.COFF_BACK_URL}/coff/docs/_v/lista/?stm=coff_docsorder_v&objid=${objId||1}&id=${id||-1}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      // console.log("------------------ getMenu ---------------------------------", url)
      const response = await axios.get(url, { headers });
      // console.log("KKKKKKK getMenu ---------------------------------@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", url, response.data)
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  } 
  
  // Vraca slog za tekucu narudzbinu koja je smestena u LocalStorage varijanta jedinice mere
  async getCurrCoffOrder(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const currCoffOrder = localStorage.getItem('currCoffOrder')
    const url = `${env.COFF_BACK_URL}/coff/docs/_v/lista/?stm=coff_currcofforder_v&objid=${objId}&id=${currCoffOrder||-1}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      console.log("KKKKKKK@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", url, response.data)
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getCoffDocss() {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.COFF_BACK_URL}/coff/docs/?sl=${selectedLanguage}`;
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

  async getCoffDocs(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.COFF_BACK_URL}/coff/docs/${objId}/?sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };
    
    try {
      const response = await axios.get(url, { headers });
      console.log(url,"*****************************Setujem stavke trenutne porudzbine*****************************", response.data)
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


  async postCoffDocs(newObj) {
    try {
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      // if (newObj.cena.trim() === '' || newObj.text.trim() === '' || newObj.valid === null) {
      //   throw new Error(
      //     "Items must be filled!"
      //   );
      // }
      const url = `${env.COFF_BACK_URL}/coff/docs/?sl=${selectedLanguage}`;
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

  async putCoffDocs(newObj) {
    try {
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      // if (newObj.code.trim() === '' || newObj.text.trim() === '' || newObj.valid === null) {
      //   throw new Error(
      //     "Items must be filled!"
      //   );
      // }
      const url = `${env.COFF_BACK_URL}/coff/docs/?sl=${selectedLanguage}`;
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

  async deleteCoffDocs(newObj) {
    try {
      const url = `${env.COFF_BACK_URL}/coff/docs/${newObj.id}`;
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

  async postDocsorder(objId, newObj, addItems) {
    try {
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      if (objId === null) {
        throw new Error(
          "objId must be filled!"
        );
      }
      const url = `${env.COFF_BACK_URL}/coff/docs/_v/lista/?stm=coff_docsorder_v&objId1=${objId}&par1=${addItems}&sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)
      
      const response = await axios.post(url, { jsonObj }, { headers });
      console.log(jsonObj, "***************************postGrpEventatts*******************************", response.data)
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }  
}

