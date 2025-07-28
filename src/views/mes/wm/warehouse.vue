<template>
    <div>
        <h1>仓库</h1>
    </div>
</template>
<script setup>
import myInput from '@/components/MyInput/myInput.vue'
import myTable from '@/components/myTable/myTable.vue'
import { ref } from 'vue';


const tableData = ref()
const tableSetting = ref({
    label:'通知单编号',
    
})

</script>