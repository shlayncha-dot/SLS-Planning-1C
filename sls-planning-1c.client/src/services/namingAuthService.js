import { verificationApi } from '../config/apiConfig';

export const getNamingAuthStatus = async () => {
    const response = await fetch(verificationApi.namingAuthStatus, {
        method: 'GET',
        headers: {
            Accept: 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Naming auth status error: ${response.status}`);
    }

    return response.json();
};

export const saveNamingCredentials = async ({ username, password }) => {
    const response = await fetch(verificationApi.namingAuthCredentials, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
        throw new Error(`Naming auth save error: ${response.status}`);
    }
};
