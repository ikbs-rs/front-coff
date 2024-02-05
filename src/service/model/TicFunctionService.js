import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

export class TicFunctionService {
  async getParpopust(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/x/privilege/_v/function/?stm=tic_pardiscountcurr_f&objid=${objId}&sl=${selectedLanguage}`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      //console.log(response.data.item, "****************************************************99999999999999999")
      return response.data.item[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getArtcena(eventId, objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/x/art/_v/function/?stm=tic_artpricecurr_f&eventid=${eventId}&objid=${objId}&sl=${selectedLanguage}`;
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

  async getArttgprate(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.TIC_BACK_URL}/tic/x/art/_v/function/?stm=tic_arttgpratecurr_f&objid=${objId}&sl=${selectedLanguage}`;
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

}

