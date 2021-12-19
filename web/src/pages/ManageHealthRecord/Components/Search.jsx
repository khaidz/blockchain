import React, {useState} from 'react';
import { Button, Tabs} from 'antd';
import CheckQR from './CheckQR';

const { TabPane } = Tabs;
export default () => {
    const [b, setB] = useState(false);
    const handleB = () => {
      setB(true);
    }
    const handleC = () => {
      setB(false);
    }
  
  return (
    <>
      <Tabs tabPosition="top">
        <TabPane tab="Tìm kiếm QR" key="2">
          {b ?
          <><CheckQR></CheckQR> <Button style={{margin: 10}} onClick={handleC}>Dừng</Button></>: <Button onClick={handleB}>Bắt đầu</Button>
          }
        </TabPane>
      </Tabs>
    </>
  )
}
