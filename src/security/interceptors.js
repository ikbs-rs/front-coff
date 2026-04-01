// useTokenValidation.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import env from "../configs/env"

const useTokenValidation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('isLoggedIn'));
  const token = localStorage.getItem('token');
  useEffect(() => {
    // proveri da li postoji token i da li je validan
    if (token && token.length > 0) {
      // Provera da li je token validan
      axios
        .post(
          `${env.JWT_BACK_URL}/adm/services/checkJwt`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000, // vreme za koje se očekuje odgovor od udaljenog servera (u milisekundama)
          }
        )
        .then((response) => {
          const isLoggedIn = response.status === 200; // Ako je status 200, isLoggedIn će biti true
          setIsLoggedIn(isLoggedIn);
        })
        .catch((error) => {
          console.error(error);
          setIsLoggedIn(false); // Ako se dogodila pogreška, isLoggedIn će biti false
        });
    } else {
      setIsLoggedIn(false);
    }
  }, [token]);

  return isLoggedIn;
};

const usePermission = (objId, par1, par2) => {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const permission = await checkPermissions(objId, par1, par2);
      setHasPermission(permission);
    };

    fetchData();
  }, [objId, par1, par2]);

  return hasPermission;
};

const useCrudActionPermissions = (objId) => {
  const canCreate = usePermission(objId, 'C');
  const canUpdate = usePermission(objId, 'U');
  const canDelete = usePermission(objId, 'D');

  return {
    canCreate,
    canUpdate,
    canDelete,
  };
};

const checkPermissions = async (objId, par1, par2) => {
  const token = localStorage.getItem('token');
  const url = `${env.JWT_BACK_URL}/adm/services/checkPermissions`;

  const data = {
    objId,
    par1: par1 || '1',
    par2: par2 || '1',
  };

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.post(url, data, config);
    if (typeof response.data === 'boolean') {
      return response.data;
    }

    return response.data?.allowed === true;
  } catch (error) {
    if (error.response?.status === 403) {
      return false;
    }

    console.error('[checkPermissions] error', {
      objId,
      par1: par1 || '1',
      par2: par2 || '1',
      message: error.message,
      responseStatus: error.response?.status,
      responseData: error.response?.data,
    });
    return false;
  }
};

export  {
  useTokenValidation,
  usePermission,
  useCrudActionPermissions,
  checkPermissions,
}
