<script>
import Vertical from "./vertical.vue";

export default {
    components: {
        Vertical
    },
    data() {
        return {
            layoutType: 'vertical'
        };
    },
};
</script>

<template>
<div>
    <Vertical v-if="layoutType === 'vertical'" :layout="layoutType">
        <slot />
    </Vertical>
</div>
</template>