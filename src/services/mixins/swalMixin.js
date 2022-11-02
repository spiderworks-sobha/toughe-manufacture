import Swal from "sweetalert2";
const swalMixin = {
    methods: {
        swal_confirm(message, action, param){
            Swal.fire({
                text: message,
                showCancelButton: true,
                confirmButtonText: "Yes",
                width: '20em',
                showClass: {
                    popup: 'animate__animated animate__fadeIn'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                },
                customClass: {
                    confirmButton: 'btn btn-sm btn-success',
                    cancelButton: 'btn btn-sm btn-secondary',
                }
            }).then((result) => {
                if (result.value) {
                    this[action](param);
                }
            });
        },
        swal_alert(message){
            Swal.fire({
                text: message,
                showClass: {
                    popup: 'animate__animated animate__fadeIn'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                },
                customClass: {
                    confirmButton: 'btn btn-sm btn-success',
                }
            });
        }
    },
};

export default swalMixin;