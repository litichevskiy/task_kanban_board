
let storage = require('../storage.js');
let pubsub = require('../utils/PubSub.js');
let formatDate = require('../utils/formatDate.js');
let sortArray = require('../utils/sortArray.js');
let searchData = require('../utils/searchData.js');

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