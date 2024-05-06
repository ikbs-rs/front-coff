import axios from 'axios';
import env from "../../../configs/env"
import Token from "../../../utilities/Token";

export class AdmUserService {
  async getAdmUserV() {
    const url = `${env.ADM_BACK_URL}/adm/user_v`;
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

  async getAdmUser(objId) {
    const url = `${env.ADM_BACK_URL}/adm/user/${objId}`;
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

  async postAdmUser(newObj) {
    try {
      if ((newObj.username.trim() === '' || !newObj.username)
        || (newObj.admin.trim() === '' || !newObj.admin)
        || (newObj.mail.trim() === '' || !newObj.mail)
        || (newObj.usergrp.trim() === '' || !newObj.usergrp)
        || (newObj.valid.trim() === '' || !newObj.valid)
        ) {
        throw new Error(
          "Items must be filled!"
        );
      }
      const selectedLanguage = localStorage.getItem('sl') || 'en'    
      const url = `${env.ADM_BACK_URL}/adm/user/?sl=${selectedLanguage}`;
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

  async putAdmUser(newObj) {
    try {
      if ((newObj.username == null || !newObj.username)
        || (newObj.admin.trim() === '' || !newObj.admin)
        || (newObj.mail.trim() === '' || !newObj.mail)
        || (newObj.usergrp.trim() === '' || !newObj.usergrp)
        || (newObj.valid.trim() === '' || !newObj.valid)
        ) {
        throw new Error(
          "Items must be filled!"
        );
      }
      const url = `${env.ADM_BACK_URL}/adm/user`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)
      const response = await axios.put(url, jsonObj, { headers });
      return response.data.items;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async deleteAdmUser(newObj) {
    const url = `${env.ADM_BACK_URL}/adm/user/${newObj.id}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      'Authorization': tokenLocal.token
    };

    try {
      const response = await axios.delete(url, { headers });
      return response.data.items;
    } catch (error) {
      throw error;
    }

  }
}

