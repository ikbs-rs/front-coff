import axios from 'axios';
import env from "../../configs/env"
import Token from "../../utilities/Token";

export class SapDataService {
  async getZapLista() {
    const url = `${env.COFF_BACK_URL}/sap/zap`;
    const tokenLocal = await Token.getTokensLS();
    const headers = {
      Authorization: tokenLocal.token
    };

    try {
      const response = await axios.get(url, { headers });
      const items = response.data?.item || response.data?.items || response.data || [];

      return items.map((item) => ({
        ...item,
        ORGID: item.orgId ?? item.ORGID ?? "",
        RMID: item.rmId ?? item.RMID ?? "",
        LOKID: item.lokId ?? item.LOKID ?? "",
        ORG: item.org ?? item.ORG ?? "",
        RM: item.rm ?? item.RM ?? "",
        NORG: item.norg ?? item.NORG ?? "",
        NRM: item.nrm ?? item.NRM ?? "",
        SVPOSLA: item.svposla ?? item.SVPOSLA ?? "",
        NVPOSLA: item.nvposla ?? item.NVPOSLA ?? "",
        LOK: item.lok ?? item.LOK ?? "",
        LOKTIP: item.lokTip ?? item.LOKTIP ?? "",
        LOKADDR: item.lokAddr ?? item.LOKADDR ?? "",
        LOKMESTO: item.lokMesto ?? item.LOKMESTO ?? "",
        ZIP: item.zip ?? item.ZIP ?? "",
        ZEMLJA: item.zemlja ?? item.ZEMLJA ?? "",
        ZAP: item.zap ?? item.ZAP ?? "",
        IME: item.ime ?? item.IME ?? "",
        SREDNJE: item.srednje ?? item.SREDNJE ?? "",
        PREZIME: item.prezime ?? item.PREZIME ?? "",
        EMAIL: item.email ?? item.EMAIL ?? "",
        ADKORISNK: item.adkorisnk ?? item.ADKORISNK ?? "",
        EMAIL_LOWER: item.email ?? item.EMAIL ?? "",
        ADKORISNIK: item.adkorisnik ?? item.ADKORISNIK ?? item.adkorisnk ?? item.ADKORISNK ?? "",
        adkorisnik: item.adkorisnik ?? item.ADKORISNIK ?? item.adkorisnk ?? item.ADKORISNK ?? "",
        email: item.email ?? item.EMAIL ?? "",
        NZAP: [item.zap ?? item.ZAP, item.ime ?? item.IME, item.prezime ?? item.PREZIME]
          .filter(Boolean)
          .join(" "),
        N2ZAP: [item.zap ?? item.ZAP, item.ime ?? item.IME, item.prezime ?? item.PREZIME]
          .filter(Boolean)
          .join(" "),
      }));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getLista(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.COFF_BACK_URL}/ems/sap/_sap/${objId}`;
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

  async getSapDatas() {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.COFF_BACK_URL}/ems/sap/?sl=${selectedLanguage}`;
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

  async getSapDatasTp(doctp) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.COFF_BACK_URL}/ems/sap/_v/lista/?stm=coff_docstp_v&objid=${doctp}&sl=${selectedLanguage}`
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

  async getSapData(objId) {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const url = `${env.COFF_BACK_URL}/ems/sap/${objId}/?sl=${selectedLanguage}`;
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

}

