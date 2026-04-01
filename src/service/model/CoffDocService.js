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

const isForbiddenError = (error) => error?.response?.status === 403;

const resolveCurrentUserId = () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    return normalizeStringId(
      storedUser?.id ??
      storedUser?.ID ??
      localStorage.getItem('userId')
    );
  } catch (error) {
    console.error(error);
    return normalizeStringId(localStorage.getItem('userId'));
  }
};

const normalizeDocPayload = (payload) => {
  const restPayload = payload || {};

  return {
    ...restPayload,
    id: normalizeStringId(restPayload.id) ?? restPayload.id,
    potpisnik: normalizeStringId(restPayload.potpisnik),
    coff: normalizeStringId(restPayload.coff),
    usr: normalizeStringId(restPayload.usr),
    ndoctp: normalizeStringId(restPayload.ndoctp) ?? restPayload.ndoctp,
  };
};

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

const normalizeDocCollection = (items) => {
  if (Array.isArray(items)) {
    return items.map((item) => normalizeDocEntity(item));
  }

  if (!items) {
    return [];
  }

  return [normalizeDocEntity(items)];
};

const resolveDocKitchenId = (item) =>
  normalizeStringId(
    item?.coff ??
    item?.obj ??
    item?.COFF ??
    item?.OBJ ??
    item?.coffid ??
    item?.coffId ??
    item?.objid ??
    item?.objId ??
    item?.coff_id ??
    item?.obj_id
  );

const filterDocsByKitchen = (items, objId) => {
  const normalizedObjId = normalizeStringId(objId);
  const normalizedItems = normalizeDocCollection(items);

  if (!normalizedObjId) {
    return normalizedItems;
  }

  return normalizedItems.filter((item) => resolveDocKitchenId(item) === normalizedObjId);
};

const resolveDocCreatorId = (item) =>
  normalizeStringId(
    item?.usr ??
    item?.USR ??
    item?.user ??
    item?.USER ??
    item?.userid ??
    item?.userId ??
    item?.createdby ??
    item?.createdBy
  );

const filterDocsByCreator = (items, userId) => {
  const normalizedUserId = normalizeStringId(userId);
  const normalizedItems = normalizeDocCollection(items);

  if (!normalizedUserId) {
    return normalizedItems;
  }

  return normalizedItems.filter((item) => resolveDocCreatorId(item) === normalizedUserId);
};

const extractPayloadItem = (payload) => {
  if (!payload) {
    return null;
  }

  return normalizeDocEntity(payload.item ?? payload.items ?? payload);
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
    // console.log(url, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@############################")
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      return normalizeDocCollection(response.data.item ?? response.data.items);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async getCoffDocsCountTp(doctp, objId = null, userId = null) {
    const normalizedObjId = normalizeStringId(objId);
    const normalizedUserId = normalizeStringId(userId);

    if (normalizedObjId || normalizedUserId) {
      const docs = await this.getCoffDocsPorudzbinaTp(doctp, normalizedObjId, normalizedUserId);
      return { count: docs.length };
    }

    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.COFF_BACK_URL}/coff/doc/_v/lista/?stm=coff_docstpcount_v&objid=${doctp}&sl=${selectedLanguage}`
    // console.log(url, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@############################")
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      return response.data.item?.[0] ?? 0;
    } catch (error) {
      if (error.response?.status === 403) {
        return 0;
      }

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

  async getCoffDocsPorudzbinaTp(doctp, objId = null, userId = null) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const normalizedObjId = normalizeStringId(objId);
    const normalizedUserId = normalizeStringId(userId);
    const kitchenParam = normalizedObjId ? `&par1=${normalizedObjId}&par2=COFFLOC` : '';
    const url = `${env.COFF_BACK_URL}/coff/doc/_v/lista/?stm=coff_docstpporudzbina_v&objid=${doctp}${kitchenParam}&sl=${selectedLanguage}`
    // console.log(url, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@############################")
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      const kitchenFilteredDocs = filterDocsByKitchen(response.data.item ?? response.data.items, normalizedObjId);
      return filterDocsByCreator(kitchenFilteredDocs, normalizedUserId);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getPotpisnikByUsername(username) {
    const normalizedUsername = normalizeStringId(username);

    if (!normalizedUsername) {
      return null;
    }

    const url = `${env.COFF_BACK_URL}/coff/doc/potpisnik/${normalizedUsername}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      return extractPayloadItem(response.data);
    } catch (error) {
      if (isForbiddenError(error)) {
        return null;
      }

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
        usr: resolveCurrentUserId() ?? normalizeStringId(newObj?.usr) ?? localStorage.getItem('userId')
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
      // console.log("**************"  , response.data, "****************@@@@@@@@@@@@@@@@@@@@@@@@@@@===================================================")
      const createdDocId = extractCreatedDocId(response.data);
      return createdDocId;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async putCoffDoc(newObj1) {
    try {
      const newObj = normalizeDocPayload({
        ...newObj1,
        usr: resolveCurrentUserId() ?? normalizeStringId(newObj1?.usr) ?? localStorage.getItem('userId')
      })
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      if (newObj.potpisnik === null) {
        throw new Error(
          "Items must be filled!"
        );
      }

      const url = `${env.COFF_BACK_URL}/coff/doc/?sl=${selectedLanguage}`;
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

  async deleteCoffDoc(newObj) {
    try {
      const url = `${env.COFF_BACK_URL}/coff/doc/${newObj.id}`;
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
      if (isForbiddenError(error)) {
        return [];
      }

      console.error(error);
      throw error;
    }
  }

}

