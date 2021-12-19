import React from 'react';
import { Layout, Menu } from 'antd';

const { Header, Content } = Layout;

export default (props) => {
    return (
        <Layout>
            <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                <div className="logo" />
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1">Tạo sổ khám</Menu.Item>
                    <Menu.Item key="2">Tạo phiếu khám</Menu.Item>
                    <Menu.Item key="3">Xác nhận thu phí</Menu.Item>
                </Menu>
            </Header>
            <Content>
                {props.children}
            </Content>
        </Layout>
    );
}