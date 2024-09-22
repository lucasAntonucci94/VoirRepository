<template>
    <button
        id="buttonLoader"
        type="submit"
        class="btn w-100"
        :disabled="loading"
    >
        <Loader v-if="loading" />
        <span v-else><slot></slot></span>
    </button>
</template>

<script>
import Loader from "./Loader.vue";
export default {
    name: "ButtonSubmitLoader",
    components: {Loader},
    props: {
        loading: {
            type: Boolean,
            default: false,
        }
    },
};
</script>

<style>
   #buttonLoader{
    background-color: #ffbd29;
    color: antiquewhite;
   }
   #buttonLoader:hover{
    background-color: #c79425;
    color: antiquewhite;
   }
</style>
