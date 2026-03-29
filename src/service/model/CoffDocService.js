import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

const normalizeStringId = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  const normalizedValue = String(value).trim();
  return normalizedValue === '' ? null : normalizedValue;
};

const normalizeDocPayload = (payload) => ({
  ...payload,
  id: normalizeStringId(payload.id) ?? payload.id,
  potpisnik: normalizeStringId(payload.potpisnik),
  coff: normalizeStringId(payload.coff),
  usr: normalizeStringId(payload.usr),
  ndoctp: normalizeStringId(payload.ndoctp) ?? payload.ndoctp,
});

const normalizeDocEntity = (item) => {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    return item;
  }

  return {
    ...item,
    id: normalizeStringId(item.id) ?? item.id,
    potpisnik: normalizeStringId(item.potpisnik) ?? item.potpisnik,
    coff: normalizeStringId(item.coff) ?? item.coff,
    usr: normalizeStringId(item.usr) ?? item.usr,
    obj: normalizeStringId(item.obj) ?? item.obj,
  };
};

const extractCreatedDocId = (responseData) => {
  if (typeof responseData === 'string') {
    const rawIdMatch = responseData.match(/"(?:items|item)"\s*:\s*("?)(-?\d+)\1/);

    if (rawIdMatch?.[2]) {
      return rawIdMatch[2];
    }

    try {
      const parsedResponse = JSON.parse(responseData);
      return String(parsedResponse.items || parsedResponse.item || "-1");
    } catch (error) {
      return "-1";
    }
  }

  return String(responseData?.items || responseData?.item || "-1");
};
	
export class CoffDocService {
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

  async getCoffDocs() {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.COFF_BACK_URL}/coff/doc/?sl=${selectedLanguage}`;
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

  async getCoffDocsTp(doctp) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.COFF_BACK_URL}/coff/doc/_v/lista/?stm=coff_docstp_v&objid=${doctp}&sl=${selectedLanguage}`
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
  async getCoffDocsCountTp(doctp) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.COFF_BACK_URL}/coff/doc/_v/lista/?stm=coff_docstpcount_v&objid=${doctp}&sl=${selectedLanguage}`
    console.log(url, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@############################")
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      return response.data.item[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getCoffDocsUser(userId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.COFF_BACK_URL}/coff/doc/_v/lista/?stm=coff_docuser_v&objid=${userId}&sl=${selectedLanguage}`

    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      // console.log(response.data, "00-USRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSR")
      return normalizeDocEntity(response.data.item);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getCoffDocsUserCoff(userId, objTp) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.COFF_BACK_URL}/coff/doc/_v/lista/?stm=coff_docusercoff_v&objid=${userId}&par1=${objTp}&sl=${selectedLanguage}`

    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      // console.log(response.data, "00-USRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSR")
      return normalizeDocEntity(response.data.item);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getCoffDocsPorudzbinaTp(doctp) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.COFF_BACK_URL}/coff/doc/_v/lista/?stm=coff_docstpporudzbina_v&objid=${doctp}&sl=${selectedLanguage}`
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

  async getCoffDoc(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.COFF_BACK_URL}/coff/doc/${objId}/?sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      return normalizeDocEntity(response.data.item);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


  async postCoffDoc(newObj) {
    try {

      const selectedLanguage = localStorage.getItem('sl') || 'en'
      const payload = normalizeDocPayload({
        ...newObj,
        usr: localStorage.getItem('userId')
      });

      if (payload.potpisnik === null) {
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
      const jsonObj = JSON.stringify(payload)
      const response = await axios.post(url, jsonObj, {
        headers,
        transformResponse: [(data) => data],
      });
      console.log("**************"  , response.data, "****************@@@@@@@@@@@@@@@@@@@@@@@@@@@===================================================")
      const createdDocId = extractCreatedDocId(response.data);
      localStorage.setItem('currCoffOrder', createdDocId);
      return createdDocId;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async putCoffDoc(newObj1) {
    try {
      const newObj = normalizeDocPayload({ ...newObj1, obj: -1 })
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      if (newObj.potpisnik === null) {
        throw new Error(
          "Items must be filled!"
        );
      }

      const currCoffOrder = localStorage.getItem('currCoffOrder')

      const url = `${env.COFF_BACK_URL}/coff/doc/?sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)
      const response = await axios.put(url, jsonObj, { headers });
      //console.log("**************"  , response, "****************")
      if (normalizeStringId(currCoffOrder) === normalizeStringId(newObj.id) && String(newObj.status) !== "0"){
        localStorage.setItem('currCoffOrder', "-1");
      }
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async deleteCoffDoc(newObj) {
    try {
      const currCoffOrder = localStorage.getItem('currCoffOrder')
      const url = `${env.COFF_BACK_URL}/coff/doc/${newObj.id}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Authorization': tokenLocal.token
      };

      const response = await axios.delete(url, { headers });
      if (normalizeStringId(currCoffOrder) === normalizeStringId(newObj.id) && normalizeStringId(newObj.id) !== "0"){
        localStorage.setItem('currCoffOrder', "-1");
      }      
      return response.data.items;
    } catch (error) {
      throw error;
    }

  }

  async getMenu(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.COFF_BACK_URL}/coff/doc/_v/lista/?stm=coff_menu_v&sl=${selectedLanguage}`;
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


  async getCmnObjListaLL(objId) {
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

}

