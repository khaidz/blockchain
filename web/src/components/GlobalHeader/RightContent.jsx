import { Typography } from 'antd';
import {  LogoutOutlined } from '@ant-design/icons';
import React from 'react';
import { connect, history } from 'umi';
import styles from './index.less';
import { logout, fetchCurrentUser } from '@/helpers/Auth';

// const ENVTagColor = {
//   dev: 'orange',
//   test: 'green',
//   pre: '#87d068',
// };


const GlobalHeaderRight = (props) => {
  const { theme, layout } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }

  const user = fetchCurrentUser()

  const handleLogout = () => {
    logout();
    if (user.user_role_name === 'Quản trị viên') return history.push('/index2');
    return history.push('/index');
  }

  return (
    <div className={className}>
      <Typography.Text style={{marginRight: '10px'}}>Xin chào <strong>{user.user_fullname}</strong></Typography.Text>
      <Typography.Link type='danger' onClick={handleLogout}>Đăng xuất <LogoutOutlined /></Typography.Link>
    </div>
  );
};

export default connect(({ settings }) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);
