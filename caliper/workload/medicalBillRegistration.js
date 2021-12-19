'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');
const {nanoid} = require('nanoid');

class MyWorkload extends WorkloadModuleBase {
    constructor() {
        super();
    }
    
    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);

    }
    
    async submitTransaction() {
        // NOOP
        const medicalBill = {
            medical_bill_id: "M" + nanoid(),
            medical_bill_health_insurance: "Test",
            medical_bill_ordinal_number: "1",
            medical_bill_department_name: "Khoa Nhi",
            medical_bill_health_record_id: "H"+ nanoid(),
            medical_bill_patient_name: "Nguyễn Hoàng Duy",
            medical_bill_patient_id: "U"+ nanoid(),
            medical_bill_physician_name: "Bác sĩ",
            medical_bill_room_name: "Phòng khám Nhi 01",
          }
        const myArgs = {
            contractId: this.roundArguments.contractId,
            contractFunction: 'createMedicalBill',
            invokerIdentity: 'User1',
            contractArguments: [
                [
                    medicalBill.medical_bill_id, 
                    medicalBill.medical_bill_department_name, 
                    medicalBill.medical_bill_health_insurance, 
                    medicalBill.medical_bill_health_record_id, 
                    medicalBill.medical_bill_ordinal_number, 
                    medicalBill.medical_bill_patient_id, 
                    medicalBill.medical_bill_patient_name, 
                    medicalBill.medical_bill_physician_name, 
                    medicalBill.medical_bill_room_name,
                ]
            ],
            readOnly: false
        };

    await this.sutAdapter.sendRequests(myArgs);
}

async cleanupWorkloadModule() {
    // NOOP
}
}

function createWorkloadModule() {
return new MyWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;