import Vue from "vue";

//导入弹框提示组件
//全局注册

import { Button, Form, FormItem, Input, Message } from "element-ui";
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.prototype.$message = Message;
//把弹框组件挂载到VUE的原型对象上
