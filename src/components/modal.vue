<script>
export default {
    components: {},
    props: {
        modalid: '', 
    },
    mounted(){
    }
};
</script>
<template>
    <div :id="modalid" class="modal fade" tabindex="-1" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none;">
        <div class="modal-dialog">
            <div class="modal-content">
                <slot />
            </div>
            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>
</template>