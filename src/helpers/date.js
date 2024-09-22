
/**
 * Le da el formato a una fecha
 *
 * @param {Date} date
 * @returns {string}
 */
 export function formatDate(date) {
    if(typeof date !== 'object') return 'xxxx-xx-xx xx:xx:xx';
    const year  = dateNormalizeNumber(date.getFullYear());
    const month = dateNormalizeNumber(date.getMonth());
    const day   = dateNormalizeNumber(date.getDate());
    const hours = dateNormalizeNumber(date.getHours());
    const mins  = dateNormalizeNumber(date.getMinutes());
    const secs  = dateNormalizeNumber(date.getSeconds());
    const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

    return `${day} ${months[month-1]} ${year} : ${hours}:${mins}:${secs}`;
}

/**
 * Agrega el 0 delante si el número es menor a 10.
 *
 * @param {number|string} datePart
 * @returns {number|string}
 */
 export function dateNormalizeNumber(datePart) {
    return datePart < 10 ? '0' + datePart : datePart;
}