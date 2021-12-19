import React, {useState, useEffect} from 'react'; // 
import {PageContainer} from '@ant-design/pro-layout';
import { Row, Col, Tooltip, Card} from 'antd';
import ChartCard from '../analysis/components/Charts/ChartCard';
import { InfoCircleOutlined } from '@ant-design/icons';
import { fetchCurrentUser } from '@/helpers/Auth';
import { DEFAULT_HOST } from '@/host';
import axios from 'axios';
import LoginChart from './LoginChart';
import MedicalBillChart from './MedicalBillChart';
import HealthRecordChart from './HealthRecordChart';

export default () => {
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [drugs, setDrugs] = useState([]);
    const [logins, setLogins] = useState([]);
    const user = fetchCurrentUser();
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }
     useEffect(() => {
        const f = async () => {
            const urlUser = `${DEFAULT_HOST}/auth`;
            const urlLogin = `${DEFAULT_HOST}/admin/login`;
            const urlDepartment = `${DEFAULT_HOST}/admin/department`;
            const urlRoom = `${DEFAULT_HOST}/admin/room`;
            const urlDrug = `${DEFAULT_HOST}/admin/drug`;
            try {
                const resultUsers = await axios.get(urlUser, config);
                setUsers(resultUsers.data);
                const resultLogins = await axios.get(urlLogin, config);
                setLogins(resultLogins.data);
                const resultDepartments = await axios.get(urlDepartment, config);
                setDepartments(resultDepartments.data);
                const resultRooms = await axios.get(urlRoom, config);
                setRooms(resultRooms.data);
                const resultDrugs = await axios.get(urlDrug, config);
                setDrugs(resultDrugs.data);
            } catch (error) {
                // alert(error);
            }
            return "";
        }
        f();
    }, []);

    let countUsers;
    let countLogins;
    let countDepartments;
    let countRooms;
    let countDrugs;

    if(users === undefined){ countUsers = 0}
    else {countUsers = users.length;}

    if(logins === undefined){ countLogins = 0}
    else {countLogins = logins.length;}

    if(departments === undefined){ countDepartments = 0}
    else {countDepartments = departments.length;}

    if(rooms === undefined){ countRooms = 0}
    else {countRooms = rooms.length;}

    if(drugs === undefined){ countDrugs = 0}
    else {countDrugs = drugs.length;}

    return (
        <PageContainer>
            <Card>
            <Row gutter={8}>
                <Col sm={16} md={6}>
                    <ChartCard
                        title="Số lượng người dùng"
                        total={countUsers}
                        // avatar={
                        //     <img
                        //         height={48}
                        //         width={48}
                        //         src={require('@/assets/registration.png')}
                        //     ></img>
                        // }
                        action={
                            <Tooltip title="Số lượng người dùng">
                                <InfoCircleOutlined />
                            </Tooltip>
                        }
                    ></ChartCard>
                </Col>
                <Col sm={16} md={6}>
                    <ChartCard
                        title="Tổng số khoa"
                        total={countDepartments}
                        // avatar={
                        //     <img
                        //         height={48}
                        //         width={48}
                        //         src={require('@/assets/registrator.png')}
                        //     ></img>
                        // }
                        action={
                            <Tooltip title="Số lượng khoa trong bệnh viện">
                                <InfoCircleOutlined />
                            </Tooltip>
                        }
                    ></ChartCard>
                </Col>
                <Col sm={16} md={6}>
                <ChartCard
                        title="Tổng số phòng"
                        total={countRooms}
                        // avatar={
                        //     <img
                        //         height={48}
                        //         width={48}
                        //         src={require('@/assets/registrator.png')}
                        //     ></img>
                        // }
                        action={
                            <Tooltip title="Số lượng phòng trong bệnh viện">
                                <InfoCircleOutlined />
                            </Tooltip>
                        }
                    ></ChartCard>
                </Col>
                <Col sm={16} md={6}>
                    <ChartCard
                        
                        title="Tổng số thuốc"
                        total={countDrugs}
                        // avatar={
                        //     <img
                        //         height={48}
                        //         width={48}
                        //         src={require('@/assets/registrator.png')}
                        //     ></img>
                        // }
                        action={
                            <Tooltip title="Số lượng thuốc trong bệnh viện">
                                <InfoCircleOutlined />
                            </Tooltip>
                        }
                    ></ChartCard>
                </Col>
                <Col sm={16} md={6}>
                    <ChartCard
                        
                        title="Tổng số lượt đăng nhập"
                        total={countLogins}
                        // avatar={
                        //     <img
                        //         height={48}
                        //         width={48}
                        //         src={require('@/assets/registrator.png')}
                        //     ></img>
                        // }
                        action={
                            <Tooltip title="Số lượt đăng nhập vào hệ thống">
                                <InfoCircleOutlined />
                            </Tooltip>
                        }
                    ></ChartCard>
                </Col>
            </Row>
        </Card>
    
        <Card>
            <LoginChart></LoginChart>
        </Card>
        <Card>
            <MedicalBillChart></MedicalBillChart>
        </Card>
        <Card>
            <HealthRecordChart></HealthRecordChart>
        </Card>
        </PageContainer>
    );
}