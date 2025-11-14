export function getHours(data) {
    const datas = new Date(data);
    const horas = datas.getHours();
    const minutos = datas.getMinutes();
    return `${horas}:${minutos < 10 ? '0' + minutos : minutos}`;
}