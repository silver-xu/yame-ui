export const saveAnonymousAuthToken = (authToken: string) => {
    const fbAuthToken = `${authToken}`;
    localStorage.setItem('auth', fbAuthToken);
};

export const saveFacebookAuthToken = (authToken: string) => {
    const fbAuthToken = `fb${authToken}`;
    localStorage.setItem('auth', fbAuthToken);
};
