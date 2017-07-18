
const TIME_CLEAR = 4000; //ms

let pubsub = require('../utils/PubSub.js');

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