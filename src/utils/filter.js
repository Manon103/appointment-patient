export function formatDate(date){
    const birthDate = new Date(date);
    const year = birthDate.getFullYear();
    const month = birthDate.getMonth()+1 > 9 ? birthDate.getMonth()+1 : '0' + (birthDate.getMonth()+1);
    const day = birthDate.getDate();
    return `${year}-${month}-${day}`
}