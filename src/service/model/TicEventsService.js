import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

export class TicEventsService {
  async getLista(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/events/_v/lista/?stm=tic_events_v&sl=${selectedLanguage}`;
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

  async getTicEventss() {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/events/?sl=${selectedLanguage}`;
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

  async getTicEvents(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/events/${objId}/?sl=${selectedLanguage}`;
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


  async postTicEvents(newObj) {
    try {
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      const url = `${env.TIC_BACK_URL}/tic/events/?sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)
      //console.log("*#################"  , jsonObj, "****************")
      const response = await axios.post(url, jsonObj, { headers });
      console.log("**************"  , response, "****************")
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async putTicEvents(newObj) {
    try {
      const selectedLanguage = localStorage.getItem('sl') || 'en'
      const url = `${env.TIC_BACK_URL}/tic/events/?sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': tokenLocal.token
      };
      const jsonObj = JSON.stringify(newObj)
      const response = await axios.put(url, jsonObj, { headers });
      console.log("*******---*******"  , response.data, "**********---******", newObj)
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  async deleteTicEvents(newObj) {
    try {
      const url = `${env.TIC_BACK_URL}/tic/events/${newObj.id}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        'Authorization': tokenLocal.token
      };

      const response = await axios.delete(url, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }

  }
}

