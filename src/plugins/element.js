import Vue from "vue";

//导入弹框提示组件


import { Button, Form, FormItem, Input, Message,
    Container, Header, Aside, Main, Menu, MenuItem, Submenu,
    MenuItemGroup, Breadcrumb, BreadcrumbItem,Card,
    Row, Col, Table, TableColumn, Switch, Tooltip, Pagination,Dialog,MessageBox,Tag,Tree,Select, Option,
     Cascader,Alert,Tabs,TabPane} from 'element-ui';
//全局注册
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use( Menu);
Vue.use(MenuItem);
Vue.use(Submenu);
Vue.use(MenuItemGroup);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Tag);
Vue.use(Tree);
Vue.use(Option);
Vue.use(Select);
Vue.use(Cascader);
Vue.use(Alert);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.prototype.$message = Message
//把弹框组件挂载到VUE的原型对象上
Vue.prototype.$confirm = MessageBox.confirm
