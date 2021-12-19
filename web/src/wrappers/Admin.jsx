import React from 'react';
import { useHistory, Redirect } from 'umi';


export default ({children}) => {
    const history = useHistory();
    const auth = JSON.parse(localStorage.getItem('auth'));

    if(!auth) return <Redirect to='/index2'></Redirect>;

    if(auth.user_role_name !== 'Quản trị viên') return history.push('/404');

    return <>{children}</>
}