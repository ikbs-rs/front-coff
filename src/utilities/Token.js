
const getTokensLS = async () => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!token || !refreshToken) {
        return null;
    }
    const jwtObj = {
        token: `Bearer ${token}`,
        refreshToken: `Bearer ${refreshToken}`,
    }
    return jwtObj;
}

export default { getTokensLS };