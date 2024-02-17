import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

export class KkDocService {
  async getLista(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.kk_BACK_URL}/kk/doc/_v/lista/?stm=kk_doc_v&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      //console.log("**********KkDocService*************",url)
      const response = await axios.get(url, { headers });
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getTransactionLista(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.kk_BACK_URL}/kk/doc/_v/lista/?stm=kk_transaction_v&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      //console.log("**********KkDocService*************",url)
      const response = await axios.get(url, { headers });
      return response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getTicListaByItem(tab, route, view, item, objId) {
    
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.kk_BACK_URL}/kk/${tab}/_v/${route}/?stm=${view}&item=${item}&id=${objId}&sl=${selectedLanguage}`;
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
  
 // ('obj', 'listabytxt', 'cmn_obj_tp_v', 'aa.doc', 'O');

  async getCmnListaByItem(tab, route, view, item, objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.CMN_BACK_URL}/cmn/x/${tab}/_v/${route}/?stm=${view}&item=${item}&id=${objId}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      return response.data.item||response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getCmnListaByItem2(tab, route, view, item1, objId1, item2, objId2) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.kk_BACK_URL}/kk/${tab}/_v/${route}/?stm=${view}&item1=${item1}&id1=${objId1}&item2=${item2}&id2=${objId2}&sl=${selectedLanguage}`;
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

  async getKkDocs() {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.kk_BACK_URL}/kk/doc/?sl=${selectedLanguage}`;
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

  async getKkDoc(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.kk_BACK_URL}/kk/doc/${objId}/?sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      return response.data.items||response.data.item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


  async postKkDoc(newObj) {
    try {
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      if (newObj.date.trim() === '' || newObj.npar.trim() === '' || newObj.pib === null) {
        throw new Error(
          "Items must be filled!"
        );
      }
      const url = `${env.kk_BACK_URL}/kk/doc/?sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)
      const response = await axios.post(url, jsonObj, { headers });
      console.log("***response.data.items***********"  , response.data.items, "****************")
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async putKkDoc(newObj) {
    try {
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      if (newObj.date.trim() === '' || newObj.npar.trim() === '' || newObj.pib === null) {
        throw new Error(
          "Items must be filled!"
        );
      }
      const url = `${env.kk_BACK_URL}/kk/doc/?sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)
      //console.log("*#################", jsonObj, "****************")
      const response = await axios.put(url, jsonObj, { headers });
      //console.log("**************"  , response, "****************")
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async deleteKkDoc(newObj) {
    try {
      const url = `${env.kk_BACK_URL}/kk/doc/${newObj.id}`;
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

  async getCmnCurrs() {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.CMN_BACK_URL}/cmn/x/curr/?sl=${selectedLanguage}`;
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

  async  getCmnPar(cmnParCode) {
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const url = `${env.CMN_URL}/?endpoint=parend&code=${cmnParCode}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };
  
    try {
      console.log(url, "***************url**************")
      const response = await axios.get(url, { headers });
      return response.data; // Očekujemo da će ovo vratiti objekat sa ključevima 'code' i 'text'
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async  getCmnParById(parId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const url = `${env.CMN_BACK_URL}/cmn/x/par/${parId}?sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };
  
    try {
      console.log(url, "***************url**************")
      const response = await axios.get(url, { headers });
      return response.data; 
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
}

