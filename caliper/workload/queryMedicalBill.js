'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');
const {nanoid, random} = require('nanoid');

const hrId = "H"+ nanoid();
class MyWorkload extends WorkloadModuleBase {
    constructor() {
        super();
    }
    
    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);
        const medicalBill = {
            medical_bill_id: "M" + nanoid(),
            medical_bill_health_insurance: "Test",
            medical_bill_ordinal_number: "1",
            medical_bill_department_name: "Khoa Nhi",
            hrId,
            medical_bill_patient_name: "Nguyễn Hoàng Duy",
            medical_bill_patient_id: "U"+ nanoid(),
            medical_bill_physician_name: "Bác sĩ",
            medical_bill_room_name: "Phòng khám Nhi 01",
            medical_bill_previous_result: "Không có",
            medical_bill_place_of_introduction: "Không có",
            medical_bill_reason_for_examination: "Sốt",
            medical_bill_medical_history: "Không có",
            medical_bill_anamnesis: "Không có",
            medical_bill_diagnose: "Sốt",
            medical_bill_appointment: "22-11-2021",
            medical_bill_treatment: "Uống thuốc kết hợp theo dõi",
            vital_signs_temperature: "38,5",
            vital_signs_blood_pressure: "120/90",
            vital_signs_breathing: "27",
            vital_signs_pluse: "90"
          }
        for (let i = 0; i < this.roundArguments.assets; i++) {
            const assetID = `${this.workerIndex}_${i}`;
            console.log(`Worker ${this.workerIndex}: Creating asset ${assetID}`);
            const request = {
                contractId: this.roundArguments.contractId,
                contractFunction: 'createMedicalBill',
                invokerIdentity: 'User1',
                contractArguments: [
                    [
                        assetID, 
                        medicalBill.medical_bill_department_name, 
                        medicalBill.medical_bill_health_insurance, 
                        medicalBill.hrId, 
                        medicalBill.medical_bill_ordinal_number, 
                        medicalBill.medical_bill_patient_id, 
                        medicalBill.medical_bill_patient_name, 
                        medicalBill.medical_bill_physician_name, 
                        medicalBill.medical_bill_room_name,
                        medicalBill.medical_bill_anamnesis,
                        medicalBill.medical_bill_appointment,
                        medicalBill.medical_bill_diagnose,
                        medicalBill.medical_bill_medical_history,
                        medicalBill.medical_bill_place_of_introduction,
                        medicalBill.medical_bill_previous_result,
                        medicalBill.medical_bill_reason_for_examination,
                        medicalBill.medical_bill_treatment,
                        medicalBill.vital_signs_blood_pressure,
                        medicalBill.vital_signs_breathing,
                        medicalBill.vital_signs_pluse,
                        medicalBill.vital_signs_temperature,
                    ]
                ],
                readOnly: false
            };
            await this.sutAdapter.sendRequests(request);
        }
    }
    
    async submitTransaction() {
        // NOOP

        try {
            const randomId = Math.floor(Math.random()*this.roundArguments.assets);
            const myArgs = {
                contractId: this.roundArguments.contractId,
                contractFunction: 'queryMedicalBill',
                invokerIdentity: 'User1',
                contractArguments:  [`${hrId}`],
                readOnly: true
            };
    
            await this.sutAdapter.sendRequests(myArgs);
        } catch (error) {
            
        }
    }
    
    async cleanupWorkloadModule() {
        for (let i=0; i<this.roundArguments.assets; i++) {
            const assetID = `${this.workerIndex}_${i}`;
            console.log(`Worker ${this.workerIndex}: Deleting asset ${assetID}`);
            const request = {
                contractId: this.roundArguments.contractId,
                contractFunction: 'deleteMedicalBill',
                invokerIdentity: 'User1',
                contractArguments: [assetID],
                readOnly: false
            };

            await this.sutAdapter.sendRequests(request);
        }
    }
}

function createWorkloadModule() {
    return new MyWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;