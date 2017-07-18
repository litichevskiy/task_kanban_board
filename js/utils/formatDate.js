module.exports = getDate;

function formatDate( item ) {

    let result = ( item < 10 ) ? '0' + item : item;

    return result;
};

function getDate( date ) {

    let _date = new Date( date ),
        month = _date.getMonth() + 1,
        day = _date.getDate(),
        hourse = _date.getHours(),
        minutes = _date.getMinutes(),
        seconds = _date.getSeconds();

    day = formatDate( day );
    month = formatDate( month );
    hourse = formatDate( hourse );
    minutes = formatDate( minutes );
    seconds = formatDate( seconds );

    let result = day + '.' + month + '  ' + hourse + ':' + minutes + ':' + seconds;

    return result;
}