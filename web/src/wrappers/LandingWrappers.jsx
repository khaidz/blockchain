import React from 'react';
import { Redirect } from 'umi';

export default (props) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    if (auth === null) {
        return <div>{props.children}</div>
    }
    return <Redirect to='/receptionist/manage-patient'></Redirect>
}