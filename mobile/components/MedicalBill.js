import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import { Card,List, Title, Divider} from 'react-native-paper';
import SubclinicalSheet from './SubclinicalSheet';
import Prescription from './Prescription';

export default function MedicalBill ({value}) {
    
    return (
         <View style={styles.view}> 
            <ScrollView >
                <Card>
                        <Title style={styles.title}>Thông tin hành chính</Title>
                        <Card style={styles.card}>
                            <List.Item
                                title="Họ và tên bệnh nhân"
                                description={value.medical_bill_patient_name}
                            />
                            
                                <Divider/>
                                <Divider/>
                            <List.Item
                                title="ID bệnh nhân"
                                description={value.medical_bill_patient_id}
                            />
                                <Divider/>
                                <Divider/>
                            
                            <List.Item
                                title="ID Sổ khám"
                                description={value.medical_bill_health_record_id}
                            />
                            
                                <Divider/>  
                                <Divider/>
                            
                            <List.Item
                                title="Số BHYT"
                                description={value.medical_bill_health_insurance}
                            />
                            
                                <Divider/>  
                                <Divider/>

                            <List.Item
                                title="Số thứ tự khám"
                                description={value.medical_bill_ordinal_number}
                            />
                            
                                <Divider/>  
                                <Divider/>
                        
                            <List.Item
                                title="Khoa"
                                description={value.medical_bill_department_name}
                            />
                                <Divider/>
                                <Divider/>
                            
                            <List.Item
                                title="Phòng"
                                description={value.medical_bill_room_name}
                            />
                                <Divider/>
                                <Divider/>
                        
                            <List.Item
                                title="Bác sĩ"
                                description={value.medical_bill_physician_name}
                            />
                        </Card>

                       <Title style={styles.title}>Dấu hiệu sinh tồn</Title>
                       <Card style={styles.card}>
                            <List.Item
                                title="Nhiệt độ"
                                description={value.vital_signs_temperature === undefined ? "Chưa có thông tin" : value.vital_signs_temperature+ " độ C"}
                            />
                            
                                <Divider/>
                                <Divider/>
                        
                            <List.Item
                                title="Huyết áp"
                                description={value.vital_signs_blood_pressure === undefined ? "Chưa có thông tin" : value.vital_signs_blood_pressure+ " mmHg" }
                            />
                                <Divider/>
                                <Divider/>
                        
                            <List.Item
                                title="Nhịp thở"
                                description={value.vital_signs_breathing === undefined ? "Chưa có thông tin" : value.vital_signs_breathing+ " nhịp/phút"}
                            />
                                <Divider/>
                                <Divider/>
                        
                            <List.Item
                                title="Nhịp tim"
                                description={value.vital_signs_pluse === undefined ? "Chưa có thông tin" : value.vital_signs_pluse+  " nhịp/phút"}
                            />
                        </Card>

                        <Title style={styles.title}>Thông tin thăm khám bệnh</Title>
                        <Card style={styles.card}>
                            <List.Item
                                title="Lý do khám bệnh"
                                description={value.medical_bill_reason_for_examination === undefined ? "Chưa có thông tin" : value.medical_bill_reason_for_examination}
                            />
                                <Divider/>
                                <Divider/>
                        
                            <List.Item
                                title="Tiền sử bệnh"
                                description={value.medical_bill_anamnesis === undefined ? "Chưa có thông tin" : value.medical_bill_anamnesis}
                            />
                                <Divider/>
                                <Divider/>
                            
                            <List.Item
                                title="Lịch sử bệnh"
                                description={value.medical_bill_medical_history === undefined ? "Chưa có thông tin" : value.medical_bill_medical_history}
                            /> 
                                <Divider/>
                                <Divider/>
                            <List.Item
                                title="Chẩn đoán bệnh"
                                description={value.medical_bill_diagnose === undefined ? "Chưa có thông tin" : value.medical_bill_diagnose}
                            /> 
                                <Divider/>
                                <Divider/>
                            <List.Item
                                title="Hẹn tái khám"
                                description={value.medical_bill_appointment === undefined ? "Chưa có thông tin" : value.medical_bill_appointment}
                            /> 
                        </Card>

                        <Title style={styles.title}>Kết quả cận lâm sàng</Title> 
                        <Card style={styles.card}>
                            <SubclinicalSheet mbId={value.medical_bill_id} ></SubclinicalSheet>
                        </Card>

                        <Title style={styles.title}>Đơn thuốc</Title>
                        <Card style={styles.card}>
                            <Prescription mbId={value.medical_bill_id}></Prescription>
                        </Card>
                        
                        <Title style={styles.title}>Trạng thái phiếu khám</Title>
                        <Card style={styles.card2}>
                        {value.medical_bill_is_completed ? <Text style={styles.completedT}>Đã hoàn thành</Text> : <Text style={styles.completedF}>Chưa hoàn thành</Text>}
                        </Card>
                </Card>
            </ScrollView>
        </View>
    );
    
}
const styles = StyleSheet.create({
    text: {
        fontSize: 18,
        color: "#00bfff"
    },
    view: {
        margin: 10,
        marginBottom: 40
    },
    title: {
        color: "#00bfff"
    },
    completedT:{
        color: 'red',
        marginStart: 10,
        marginBottom: 10
    },
    completedF:{
        color: 'gray',
        marginStart: 10,
        marginBottom: 10
    },
    card: {
        margin: 5,
        padding: 5,
        borderWidth: 1
    } ,
    card2: {
        margin: 5,
        padding: 5,
        borderWidth: 1,
        marginBottom: 10
    } 
  });

