
let pubsub = require('./utils/PubSub.js');
let searchData = require('./utils/searchData.js');

function setPriority( string ) {

    let type = { 'hight': 2, 'normal': 1, 'low' : 0 };

    return type[string];
};

let storage = (function() {

    if( !localStorage.getItem('__storage') ) {

        localStorage.setItem('__storage', JSON.stringify( [] ) );
        console.log( 'localStorage: A repository was created' );
    }

    return {

        add: function( data ) {

            let storage = JSON.parse( localStorage.getItem('__storage') );

            data.date = +new Date;
            data.id = storage.length;
            data.status = 'do it';
            data.__type = setPriority( data.type );
            storage.push( data );

            localStorage.setItem('__storage', JSON.stringify( storage ) );

            pubsub.publish('do it', data );
        },

        getList: function() {

            return JSON.parse( localStorage.getItem('__storage') );
        },

        delete: function( data ) {

            let storage = JSON.parse( localStorage.getItem('__storage') ),
                item = searchData( storage, +data.id ),
                index = storage.indexOf( item );

            if( index < 0 ) throw{ message: 'item undefined' };
            else storage.splice( index, 1 );

            localStorage.setItem('__storage', JSON.stringify( storage ) );
        },

        replaceType: function( data ) {

            let storage = JSON.parse( localStorage.getItem('__storage') ),
                item = searchData( storage, +data.id );

            item.type = data.type;

            localStorage.setItem('__storage', JSON.stringify( storage ) );
        },

        replaceTypeAndDescription: function( data ) {

            let storage = JSON.parse( localStorage.getItem('__storage') ),
                item = searchData( storage, +data.id );

            item.type = data.type;
            item.description = data.description;

            localStorage.setItem('__storage', JSON.stringify( storage ) );
        },

        updateType: function( data ) {

            let storage = JSON.parse( localStorage.getItem('__storage') ),
                item = searchData( storage, +data.id );

            if( data.status === 'do it' ) item.status = 'in progress';
            else
                if( data.status === 'in progress' ) item.status = 'done';
                else
                    if( data.status === 'aborted' ) item.status = 'aborted';


            pubsub.publish( item.status, item );
            localStorage.setItem('__storage', JSON.stringify( storage ) );
        },

        init: function( data ) {

            pubsub.subscribe( 'add_task', this.add );
            pubsub.subscribe( 'update_task', this.update );
            pubsub.subscribe( 'delete_task', this.delete );
            pubsub.subscribe( 'start', this.updateType );
            pubsub.subscribe( 'aborted_task', this.updateType );
            pubsub.subscribe( 'replace_type', this.replaceType );
            pubsub.subscribe( 'replace_type_and_description', this.replaceTypeAndDescription );
        }
    }

})();

storage.init();

module.exports = storage;