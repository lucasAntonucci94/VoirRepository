<template>
    <time>{{formattedDate}}</time>
</template>

<script>
import {formatDate} from "./../helpers/date.js";

export default {
    name: "DateFormatted",
    components: {},
    // Con props definimos que "propiedades" recibe el componente, y que checkeos Vue debería hacer sobre
    // ellos.
    // Las propiedades son los valores que se reciben del componente padre, a través de "atributos" de HTML.
    props: {
        date: {
            type: Object
        }
    },
    data: () => ({}),
    // computed sirve para definir las "propiedades computadas".
    // Una propiedad computada es aquella que se crea a partir de valores del state/props del componente,
    // y que se cachean hasta que el state/prop del que depende se actualice.
    computed: {
        formattedDate() {
            return formatDate(this.date?.toDate());
        }
    },
    // Con los métodos podemos agregar funciones que pueden ejecutarse en otras partes del componente, así
    // como en su template.
    methods: {
        /*
         * Definimos el método que hacemos disponible en el template.
         *
         * @param {Date|null} date
         * @returns {string}
         */
        // formatDate(date) {
        //     // Llamamos a la función que importamos. Pese a que se llaman igual, no hay conflictos
        //     // porque una es un método y la otra una función global.
        //     return formatDate(date);
        // }
    }
};
</script>

<style>

</style>
