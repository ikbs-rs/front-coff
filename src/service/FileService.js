import axios from "axios";
import env from "../configs/env";
import Token from "../utilities/Token";

class FileService {
  
  async getFile(fileName, relpath) {
    try {
      const selectedLanguage = localStorage.getItem("sl") || "en";
      const url = `${env.IMG_BACK_URL}/public/tic/${fileName}/?relpath=${relpath}&sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        Authorization: tokenLocal.token,
      };

      const response = await axios.get(url, { headers });

      console.log("File deleted:", fileName);
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }

  async uploadFile(file, fileName, relpath) {
    try {
      const selectedLanguage = localStorage.getItem("sl") || "en";
      //const url = `http://ws11.ems.local:8305/public/tic/upload/?sl=${selectedLanguage}`;
      const url = `${env.IMG_BACK_URL}/public/tic/upload/?relpath=${relpath}&sl=${selectedLanguage}`;
      const formData = new FormData();
      formData.append("file", file, fileName);
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        Authorization: tokenLocal.token,
      };

      const response = await axios.post(url, formData, { headers });
      return {status: response.status, message: response.data.message};
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  async deleteFile(fileName, relpath) {
    try {
      const selectedLanguage = localStorage.getItem("sl") || "en";
      const url = `${env.IMG_BACK_URL}/public/tic/delete/${fileName}/?relpath=${relpath}&sl=${selectedLanguage}`;
      const tokenLocal = await Token.getTokensLS();
      const headers = {
        Authorization: tokenLocal.token,
      };

      const response = await axios.delete(url, { headers });

      console.log("File deleted:", fileName);
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }
  
}

export default FileService;
