import React, { useState, useEffect } from 'react';
import { Table } from 'antd';

import axios from 'axios';
import moment from 'moment';

import { fetchCurrentUser } from '@/helpers/Auth';
import { DEFAULT_HOST } from '@/host';

moment.locale('en');

export default ({ mbId }) => {
    const [drugData, setDrugData] = useState([]);
    const [tloading, setTloading] = useState(true);
    const user = fetchCurrentUser();
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    };

    const fetchDrug = async () => {
        try {
            setTloading(true);
            const url = `${DEFAULT_HOST}/physician/search-prescription?field=prescription_medical_bill_id&value=${mbId}`; // prescription`
            const result = await axios.get(url, config);
            return result.data.data;
        } catch (error) {
            // console.log(error);
        }
        return '';
    };
    useEffect(() => {
        const f = async () => {
            const drug = await fetchDrug();
            setDrugData(drug);
            setTloading(false);
            return '';
        };
        f();
    }, []);

    const columns = [
        {
            title: 'Tên thuốc',
            key: 'prescription_drug_name',
            dataIndex: 'prescription_drug_name',
        },
        {
            title: 'Dạng thuốc',
            key: 'prescription_drug_dosage_form',
            dataIndex: 'prescription_drug_dosage_form',
        },
        {
            title: 'Đơn vị thuốc',
            key: 'prescription_drug_unit',
            dataIndex: 'prescription_drug_unit',
        },
        {
            title: 'Đường dùng',
            key: 'prescription_drug_route',
            dataIndex: 'prescription_drug_route',
        },
        {
            title: 'Cách dùng thuốc',
            key: 'prescription_drug_instruction',
            dataIndex: 'prescription_drug_instruction',
        },
        {
            title: 'Số lượng thuốc',
            key: 'drug_numbers',
            dataIndex: 'drug_numbers',
        },
        {
            title: 'Chỉ định của bác sĩ',
            key: 'prescription_doctor_instruction',
            dataIndex: 'prescription_doctor_instruction',
        },
    ];

    return (
        <>
            <Table
                loading={tloading}
                dataSource={drugData}
                columns={columns}
                pagination={{ pageSize: 6 }}
            ></Table>
        </>
    );
};
