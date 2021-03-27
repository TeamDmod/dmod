export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";


export const login = (user) => ({
    type: LOGIN,
    payload: user 
});

export const logout = () => ({
    type: LOGOUT
});