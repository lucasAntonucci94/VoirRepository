<template>
    <span class="lds-dual-ring"><span class="visually-hidden">Loading ...</span></span>
</template>

<script>
export default {
    name: "Loader",
};
</script>

<style>
.lds-dual-ring {
    display: inline-block;
    width: 25px;
    height: 25px;

}

.lds-dual-ring:after {
    content: " ";
    display: block;
    width: 25px;
    height: 25px;
    margin: 5px;
    border-radius: 50%;
    border: 6px solid #fff;
    border-color: #fff transparent #fff transparent;
    animation: lds-dual-ring 1.2s linear infinite;
}

.lds-dual-ring.gray:after {
    border-color: #333 transparent #333 transparent;
}

.lds-dual-ring.resizeBig:after {
    width: 125px;
    height: 125px;
    margin-top:  125px;
}
@keyframes lds-dual-ring {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
