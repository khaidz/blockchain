import React, { useState, useEffect } from 'react';
import {
    Card,
    Image,
    Table,
    // Row,
    // Col,
    // Divider,
    // Button,
    // Space,
    // Modal,
    // message,
    // Tag
} from 'antd';
// import { PageContainer } from '@ant-design/pro-layout';
import axios from 'axios';
import moment from 'moment';
// import { PlusOutlined } from '@ant-design/icons';
import {fetchCurrentUser} from '@/helpers/Auth'
import { DEFAULT_HOST } from '@/host';
// import SubclinicalForm from './SubclinicalForm';

moment.locale('en');

// const { Search } = Input;
// const { Option } = Select;


export default ({mbId}) => {
    // const [formVisible, setFormVisible] = useState(false);
    // const [editRow, setEditRow] = useState({});
    const [ssData, setSSData] = useState([]);
    // const [editDrug, setEditDrug] = useState(false);
    const [tloading, setTloading] = useState(true);
    const user = fetchCurrentUser();
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    };

    const fetchSS = async () => {
            try {
                setTloading(true);
                const url = `${DEFAULT_HOST}/physician/search-subclinical-sheet?field=subclinical_sheet_medical_bill_id&value=${mbId}`;  // prescription`
                const result = await axios.get(url, config);
                return result.data.data;
            } catch (error) {
                
                // console.log(error);
            }
            return "";
    };
    useEffect(() => {
        const f = async () => {
            const drug = await fetchSS();
            setSSData(drug);
            setTloading(false);
            return "";
        };
        f();
    }, []);

    const columns = [
        {
            title: 'Tên cận lâm sàng',
            key: 'subclinical_name',
            dataIndex: 'subclinical_name',
        },
        {
            title: 'Kết quả cận lâm sàng',
            key: 'subclinical_sheet_results',
            dataIndex: 'subclinical_sheet_results',
        },
        {
            title: 'Hình ảnh kết quả',
            render: (text,record) => {
                return (
                    <>{
                        record.subclinical_sheet_images !== undefined ? 
                                record.subclinical_sheet_images.map((element) =>  {
                                     return <Card key={element.uid} style={{margin: 3, float: 'left'}}><Image  src={`http://localhost:3000/upload/${element.name}`} width={150} height={100} ></Image></Card>
                                    } 
                               ) : <></>
                       
                        }
                    </>
                )
            },
        },
    ];

    return (
        <>
            <Card>
                <Table loading={tloading} dataSource={ssData} columns={columns} pagination={{pageSize:6}}></Table>
            </Card>
       </>
    );
};