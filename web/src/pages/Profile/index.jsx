import React from 'react';
import { Card, Tabs, Col, Row} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import Profile from './components/Profile';
import ChangePassword from './components/ChangePassword';

const tabcol = {
    xl: {
        span: 18
    },
    md: {
        span: 18
    },
    sm: {
        span: 24
    }
}

const { TabPane } = Tabs;
export default () => {
    return (
        <PageContainer>
                <Row>
                    <Col {...tabcol}>
                        <Card bordered>
                            <Tabs tabPosition="left">
                                <TabPane tab="Thông tin cá nhân" key="1" >
                                    <Profile></Profile>
                                </TabPane>
                                <TabPane tab="Đổi mật khẩu" key="2">
                                    <ChangePassword></ChangePassword>
                                </TabPane>
                                {/* <TabPane tab="Chỉnh sửa thông tin" key="3" >
                                    <EditForm></EditForm>
                                </TabPane> */}
                            </Tabs>
                        </Card>
                    </Col>
                </Row>
        </PageContainer>
    );
}