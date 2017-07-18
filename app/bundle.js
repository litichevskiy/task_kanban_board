/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	(function() {

	    let pubsub = __webpack_require__(1);
	    let form_add_card = __webpack_require__(2);
	    let storage = __webpack_require__(3);
	    let component_state_task = __webpack_require__(9);

	    Vue.component('board', {

	        components:{ form_add_card, component_state_task },

	        template:   `<div class="container_app" >
	                        <div class="wrapper">
	                            <nav class="nav_bar">
	                            <ul class="list_nav_bar">
	                                <li class="item_list_nav_bar">
	                                    <button @click="showForm()" class="button" >add task</button>
	                                </li>
	                            </ul>
	                            </nav>
	                            <form_add_card></form_add_card>
	                            <div class="container_bloks">
	                                <component_state_task name="do it"></component_state_task>
	                                <component_state_task name="in progress"></component_state_task>
	                                <component_state_task name="done"></component_state_task>
	                                <component_state_task name="aborted"></component_state_task>
	                            </div>
	                        </div>
	                    </div>`,

	        mounted() {

	        },


	        methods:{

	            showForm: function() {

	                pubsub.publish('showForm' );
	            }
	        }
	    });

	    new Vue({

	      el: '#app'

	    });

	})();

/***/ },
/* 1 */
/***/ function(module, exports) {

	let pubsub = new PubSub();

	module.exports = pubsub;

	function PubSub ( ) {
	    this.storage = {};
	};

	PubSub.prototype.subscribe = function( eventName, func ){
	    if ( !this.storage.hasOwnProperty( eventName ) ){
	        this.storage[eventName] = [];
	    }
	    this.storage[eventName].push( func );
	};

	PubSub.prototype.publish = function( eventName, data ){
	    ( this.storage[eventName] || [] ).forEach( function( func ){

	            func( data )
	        });
	};

	PubSub.prototype.unSubscribe = function( eventName, func ){
	    var index = this.storage[eventName].indexOf( func );

	    if ( index > -1 ){

	        this.storage[eventName].splice( index, 1  )
	    };
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	
	const TIME_CLEAR = 4000; //ms

	let pubsub = __webpack_require__(1);

	module.exports = {

	    template:`<div v-if="isShow" class="form_add_card" :class="{ show:isShow }">
	                <div class="text_right">
	                    <span class="close" @click="showHideForm()">&#10060;</span>
	                </div>
	                <div class="container_item_form">
	                    <input class="input" type="text" placeholder="name" v-model="name" />
	                    <span v-if="errorName" class="error">поле неможет быть пустым</span>
	                    <span v-if="!errorName" class="description_form">имя задачи</span>
	                </div>
	                <div class="container_item_form">
	                    <span v-if="!errorType" class="content">приоритет задачи:</span>
	                    <span v-if="errorType" class="error" >выбери один из</span>
	                    <label>
	                        <input type="radio" name="priority" value="low" v-model="type" />
	                        <span class="low">low</span>
	                    </label>
	                    <label>
	                        <input type="radio" name="priority" value="normal" v-model="type" />
	                        <span class="normal">normal</span>
	                    </label>
	                    <label>
	                        <input type="radio" name="priority" value="hight" v-model="type" />
	                        <span class="hight">hight</span>
	                    </label>
	                </div>
	                <div class="container_item_form">
	                    <textarea class="description" placeholder="description" v-model="description"></textarea>
	                    <span v-if="errorDescription" class="error">поле неможет быть пустым</span>
	                    <span v-if="!errorDescription" class="description_form" >описание задачи</span>
	                </div>
	                <div class="container_item_form text_right">
	                    <button class="button" @click="send()">add</button>
	                </div>
	            </div>`,

	    data:function(){

	        return{

	            type:'',
	            description: '',
	            name: '',
	            errorDescription: false,
	            errorType: false,
	            errorName: false,
	            isShow: false
	        }
	    },

	    mounted() {

	        pubsub.subscribe('showForm', this.showHideForm );
	    },

	    destroyed() {},

	    methods:{

	        showHideForm: function() {

	            this.isShow = !this.isShow;
	        },

	        send:function() {

	            let is_valid = this.checkValue();

	            if( !is_valid ) return this.clearError();

	            let data = {

	                name: this.name,
	                description: this.description,
	                type: this.type
	            }

	            pubsub.publish('add_task', data );

	            this.showHideForm();
	            this.clear();
	        },

	        checkValue: function() {

	            let is_valid = true;

	            if( !this.name.trim() ) this.errorName = true, is_valid = false;
	            else
	                if( !this.type.trim() ) this.errorType = true, is_valid = false;
	                else
	                    if( !this.description.trim() ) this.errorDescription = true, is_valid = false;

	            return is_valid;
	        },

	        clearError: function() {

	            let that = this;

	            setTimeout(function() {

	                that.errorType = false;
	                that.errorDescription = false;
	                that.errorName = false;

	            }, TIME_CLEAR );
	        },

	        clear: function( list ) {

	            this.type = '';
	            this.name = '';
	            this.description = '';
	        }
	    }
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	
	let pubsub = __webpack_require__(1);
	let searchData = __webpack_require__(8);

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

/***/ },
/* 4 */,
/* 5 */
/***/ function(module, exports) {

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

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = sortArray;

	function sortArray( list, key ) {

	    if( key === undefined ) throw{ message: 'module required key' };

	    function mySort( a, b ) {

	        if( a[key] > b[key] ) return -1;
	        if( a[key] < b[key] ) return 1;
	    };

	    return list.sort( mySort );
	};

/***/ },
/* 7 */,
/* 8 */
/***/ function(module, exports) {

	
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

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	
	let storage = __webpack_require__(3);
	let pubsub = __webpack_require__(1);
	let formatDate = __webpack_require__(5);
	let sortArray = __webpack_require__(6);
	let searchData = __webpack_require__(8);

	module.exports = {

	    template:   `<div class="component_state_task" >
	                    <div class="container_header">
	                        <h4 class="header">{{name.toUpperCase()}}</h4>
	                        <span v-if="list.length > 1" class="container_sort_elem">
	                            <span class="sort">sort priority</span>
	                            <span class="pointer" @click="sortList('__type')">&#8593;</span>
	                            <span class="pointer" @click="sortList('__type', 'reverse')">&#8595;</span>
	                        </span>
	                        <span v-if="list.length > 1" class="container_sort_elem">
	                            <span class="sort">sort time</span>
	                            <span class="pointer" @click="sortList('date')" >&#8593;</span>
	                            <span class="pointer" @click="sortList('date', 'reverse')">&#8595;</span>
	                        </span>
	                    </div>
	                    <ul class="list_bord">
	                        <li v-for="item in list" :class="item.type" class="item_list_bord" :data-id="item.id" >
	                            <div class="text_right">
	                                <time>{{getDate( item.date )}}</time>
	                            </div>
	                            <span>{{item.name}}</span>
	                            <div class="description_task" >
	                                {{item.description}}
	                                <div  v-if="isDoItAndProgress(name)" class="text_right">
	                                    <span class="edit_task" @click="editTask( item.id )">edit task</span>
	                                </div>
	                            </div>
	                            <div v-if="isDoItAndProgress(name)" class="text_right_left">
	                                <button class="aborted" @click="abortedTask( item.id)" >aborted</button>
	                                <button class="button" @click="startTask( item.id )" >start</button>
	                            </div>
	                            <div v-if="isDaneAndAborted(name)" class="text_right">
	                                <button class="button delete" @click="deleteTask( item.id )" >delete</button>
	                            </div>
	                        </li>
	                    </ul>
	                    <div v-if="is_edit" class="block_edit" @click="hideEdit( $event.target )" data-role="close" >
	                        <div class="editor">
	                            <div class="text_right">
	                                <span class="close" @click="hideEdit( $event.target )" data-role="close">&#10060;</span>
	                            </div>
	                            <span class="content">{{ currentName}}</span>
	                            <div class="container_item_form">
	                                <span >replace state</span>
	                                <label>
	                                    <input type="radio" name="priority" value="low" v-model="type" />
	                                    <span class="low">low</span>
	                                </label>
	                                <label>
	                                    <input type="radio" name="priority" value="normal" v-model="type" />
	                                    <span class="normal">normal</span>
	                                </label>
	                                <label>
	                                    <input type="radio" name="priority" value="hight" v-model="type" />
	                                    <span class="hight">hight</span>
	                                </label>
	                            </div>
	                            <div v-if="name === 'in progress'" class="text_right" >
	                                <button class="button" @click="replaceState()">save</button>
	                            </div>
	                            <div v-if="name === 'do it'" class="container_item_form text_right">
	                                <span v-if="errorDescription" class="error">поле неможет быть пустым</span>
	                                <textarea class="description" placeholder="description" v-model="description"></textarea>
	                                <button class="button" @click="saveEdit()">save</button>
	                            </div>
	                        </div>
	                    </div>
	                </div>`,

	    props: ['name'],

	    mounted() {

	        pubsub.subscribe( this.name , this.addItem );

	        let data = storage.getList();

	        this.init( data );
	    },

	    data:function(){

	        return{

	            list: [],
	            is_edit: false,
	            description: '',
	            errorDescription: false,
	            type: '',
	            currentName: '',
	            currentId: ''
	        }
	    },

	    methods:{

	        init: function( data ) {

	            let result = [], that = this;

	            data.forEach(function( item ) {

	                if( item.status === that.name ) result.push( item );

	            });

	            this.list = sortArray(  result, '__type' );
	        },

	        isDoItAndProgress: function( name ) {

	            if( name === 'do it' || name === 'in progress' ) return true
	        },

	        isDaneAndAborted: function( name ) {

	            if( name === 'done' || name === 'aborted' ) return true
	        },

	        addItem: function( data ) {

	            this.list.push( data );

	            this.list = sortArray( this.list, '__type' );
	        },

	        getDate: function( date ) {

	            return formatDate( date );
	        },

	        startTask: function( id, bol ) {

	            let data = searchData( this.list, +id ),
	                index = this.list.indexOf( data );

	            if( index < 0 ) throw{ message: 'data undefined' };

	            this.list.splice( index, 1 );

	            if( bol ) return data;
	            else pubsub.publish( 'start', data );
	        },

	        abortedTask: function( id ) {

	            let data = this.startTask( id, true );

	            data.status = 'aborted';

	            pubsub.publish( 'aborted_task', data );
	        },

	        deleteTask: function( id ) {

	            let data = this.startTask( id, true );

	            pubsub.publish( 'delete_task', data );
	        },

	        editTask: function( id ) {

	            if( !this.is_edit )this.is_edit = true;
	            else return

	            let data = searchData( this.list, +id );

	            this.currentId = id;
	            this.currentName = data.name;
	            this.type = data.type;
	            this.description = data.description;
	        },

	        replaceState: function() {

	            let data = searchData( this.list, +this.currentId );

	            data.type = this.type;
	            pubsub.publish('replace_type', data );

	            this.is_edit = false;
	        },

	        saveEdit: function() {

	            if( !this.description ) this.errorDescription = true;

	            else{

	                let data = searchData( this.list, +this.currentId );

	                data.type = this.type;
	                data.description = this.description;

	                pubsub.publish('replace_type_and_description', data );

	                this.is_edit = false;
	                this.description = '';
	                this.errorDescription = false;
	            }
	        },

	        hideEdit: function( target ) {

	            if( !this.is_edit ) return;

	            if( target.dataset.role === 'close' ) this.is_edit = false;
	        },

	        sortList: function( key, is_reverse ) {

	            this.list = sortArray( this.list, key );

	            if( is_reverse ) this.list.reverse();
	        }
	    }
	}

/***/ }
/******/ ]);