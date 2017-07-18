(function() {

    let pubsub = require('./utils/PubSub.js');
    let form_add_card = require('./components/form_add_card.js');
    let storage = require('./storage.js');
    let component_state_task = require('./components/component_state_task.js');

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