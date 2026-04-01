import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

const normalizeParamId = (value, fallback = "-1") => {
  if (value === null || value === undefined) {
    return fallback;
  }

  const normalizedValue = String(value).trim();
  return normalizedValue === '' ? fallback : normalizedValue;
};

const parseDecimal = (value) => {
  if (value === null || value === undefined) {
    return 0;
  }

  const normalizedValue = String(value).replace(',', '.').trim();

  if (!normalizedValue) {
    return 0;
  }

  const parsedValue = Number(normalizedValue);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const formatToOneDecimal = (value) => Number(parseDecimal(value).toFixed(1));

const normalizeDocsPayload = (value) => {
  const newObj = { ...(value || {}) };
  const calculatedDuguje = formatToOneDecimal(parseDecimal(newObj.ulaz) * parseDecimal(newObj.cena));
  const calculatedPotrazuje = formatToOneDecimal(parseDecimal(newObj.izlaz) * parseDecimal(newObj.cena));

  return {
    ...newObj,
    org: newObj.org ?? -1,
    obj: newObj.obj ?? null,
    cena: newObj.cena === null || newObj.cena === undefined || String(newObj.cena).trim() === ''
      ? null
      : formatToOneDecimal(newObj.cena),
    duguje: newObj.duguje === null || newObj.duguje === undefined ? calculatedDuguje : newObj.duguje,
    potrazuje: newObj.potrazuje === null || newObj.potrazuje === undefined ? calculatedPotrazuje : newObj.potrazuje,
  };
};
		
export class CoffDocsService {

  // Vraca varijante jedinice mera za unos kolicine KOM/FLASA
  async getDocsorder(objId, id) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    // const currCoffOrder = localStorage.getItem('currCoffOrder')
    const url = `${env.COFF_BACK_URL}/coff/docs/_v/lista/?stm=coff_docsorder_v&objid=${normalizeParamId(objId, "1")}&id=${normalizeParamId(id)}&sl=${selectedLanguage}`;
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
    const url = `${env.COFF_BACK_URL}/coff/docs/_v/lista/?stm=coff_currcofforder_v&objid=${normalizeParamId(objId)}&id=${normalizeParamId(currCoffOrder)}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      // console.log("KKKKKKK@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", url, response.data)
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


  async postCoffDocs(newObj1) {
    try {
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      const newObj = normalizeDocsPayload(newObj1)
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
      const payload = normalizeDocsPayload(newObj)
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
      const jsonObj = JSON.stringify(payload)
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

