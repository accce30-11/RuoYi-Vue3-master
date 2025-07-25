import { defineStore } from "pinia";

export const useWorkstationStore = defineStore('workstation',{
    state:()=>({
        workstationId:''
    }),
    actions:{
        setWorkstationId(id){
            this.workstationId = id;
        }
    }
})