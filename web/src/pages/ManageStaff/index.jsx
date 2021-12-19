import React from 'react';
import { Card} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import Search from './Components/Search';

export default () => {
    
    return (
        <PageContainer >
            <Card>
                <Search></Search>
            </Card>
            
        </PageContainer>
    );
}