<template>
    <div role="alert" :class="['alert alert-dismissible', `alert-${type}`]">
        <slot></slot>
        <!-- <button
            v-if="closable"
            type="button"
            class="btn btn-close"
            aria-label="Cerrar alerta"
            @click="$emit('close')"
        >
        <i class="fa-solid fa-circle-xmark"></i>
        </button> -->
    </div>
</template>

<script>
export default {
    name: "Alert",
    components: {},
    // Indicamos en el componente mismo qué eventos emite.
    // emits: ['close'],
    props: {
        type: { type: String, default: 'info', },

        closable: { type: Boolean, default: false, }
    },
    data: () => ({}),
    computed: {},
    methods: {}
};
</script>

<style>

</style>
