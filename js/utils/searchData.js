
module.exports = searchData;

function searchData( list, id ) {

    let result;

    list.every(function( item, i ) {

        if( +item.id !== id ) return true;

        else {
            result = item;
            return false;
        }
    });

    return result;
};