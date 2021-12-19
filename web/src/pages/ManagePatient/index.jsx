import React from 'react';
import { Card } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import Search from './Components/Search';
// import CheckQR from '../ImageQR/Components/CheckQR';
// import Check2 from '../ImageQR/Components/Check2';


export default () => {
    return (
        <PageContainer>
                    <Card>
                        <Search></Search>
                    </Card>
        </PageContainer>
    );
}