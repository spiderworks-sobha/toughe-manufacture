<script>
import { useRoute } from 'vue-router';

    export default {
        mounted(){
            localStorage.removeItem("userdata");
            localStorage.removeItem("jwt");
            this.$router.push({ name: 'login')
        },
    }
</script>

<template>
    
</template>