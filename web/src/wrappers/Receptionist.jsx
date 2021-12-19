import React from 'react';
import { useHistory, Redirect } from 'umi';


export default ({children}) => {
    const history = useHistory();
    const auth = JSON.parse(localStorage.getItem('auth'));

    if(!auth) return <Redirect to='/index'></Redirect>;

    if(auth.user_role_name !== 'Lễ tân') return history.push('/404');

    return <>{children}</>
}