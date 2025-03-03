export const clearStorage = () => sessionStorage.clear();

export const getItemFromStorage = key => {
  if (!sessionStorage) return undefined;

  try {
    return JSON.parse(sessionStorage.getItem(key));
  } catch (err) {
    console.error(`Error getting item ${key} from sessionStoragee`, err);
    return undefined;
  }
};

export const storeItem = (key, item) => {
  if (!sessionStorage) return;

  try {
    sessionStorage.setItem(key, JSON.stringify(item));
  } catch (err) {
    console.error(`Error storing item ${key} to sessionStoragee`, err);
  }
};

export const removeItemFromStorage = key => {
  if (!sessionStorage) return;

  try {
    sessionStorage.removeItem(key);
  } catch (err) {
    console.error(`Error removing item ${key} from sessionStoragee`, err);
  }
};

export const setTokens = data => {
  if (data) {
    localStorage.setItem('tokens', JSON.stringify(data));
  }
};

export const setUser = user => {
  user.logged_in = true;
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export const getTokens = () => {
  const emptyRes = { access_token: '', refresh_token: '' };
  const res = JSON.parse(localStorage.getItem('tokens'));
  return res || emptyRes;
};

export const clearLocalStorage = () => {
  localStorage.clear();
  localStorage.setItem('user', JSON.stringify({ logged_in: false }));
};

export const clearSessionStorage = () => {
  sessionStorage.clear();
};
