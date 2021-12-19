export const login = (token, user) => {
    const dataToStore = {token, ...user}
    localStorage.setItem('auth', JSON.stringify(dataToStore));
}

export const logout = () => {
    localStorage.removeItem('auth');
}

export const fetchCurrentUser = () => {
    return JSON.parse(localStorage.getItem('auth')); 
}