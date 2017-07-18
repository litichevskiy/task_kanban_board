module.exports = sortArray;

function sortArray( list, key ) {

    if( key === undefined ) throw{ message: 'module required key' };

    function mySort( a, b ) {

        if( a[key] > b[key] ) return -1;
        if( a[key] < b[key] ) return 1;
    };

    return list.sort( mySort );
};