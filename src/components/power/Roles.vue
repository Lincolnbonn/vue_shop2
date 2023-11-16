<template>
    <div>
     <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

     <!--卡片视图-->
   <el-card>
    <el-row>
         <el-col>
            <el-button type="primary">添加角色</el-button>
         </el-col>
    </el-row>

    <!--角色列表区域-->
    <el-table :data="rolelist" border stripe>
        <!--展开列-->
        <!--先分行 然后定义每行有几列 每列宽度多少-->
         <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
               :key="item1.id">
                 <!--渲染一级权限-->
                 <el-col :span="5"><!--占5列-->
                   <el-tag closable @close="removeRightById(scope.row, item1.id)"> {{ item1.authName }}</el-tag>
                   <i class="el-icon-caret-right"></i>
                 </el-col>
                   <!--渲染二级和三级权限-->
                 <el-col :span="19">
                  <!--通过for循环 嵌套渲染二级权限-->
                   <el-row :class="[i2 === 0 ? '' : 'bdtop',
                  '', 'vcenter']" v-for="(item2, i2)
                   in item1.children" :key="item2.id">
                     <el-col :span="6"><!--占的宽度占6列-->
                       <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                       <i class="el-icon-caret-right"></i>
                      </el-col>
                     <el-col :span="18">
                       <el-tag type = "warning" v-for="(item3, i3) in item2.children"
                       :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">{{item3.authName }}</el-tag>
                     </el-col>
                   </el-row>
                 </el-col>
              </el-row>
              <!--<pre>
                 {{scope.row }}
              </pre>-->
            </template>
         </el-table-column>
        <!--索引列-->
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName">
      </el-table-column>
    <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
    <el-table-column label="操作"  width="300px">
        <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">搜索</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting"
            @click="showSetRightDialog(scope.row)">分配权限</el-button>
        </template>
    </el-table-column>
    </el-table>


  </el-card>

  <!--分配权限的对话框-->
  <el-dialog title="分配权限" :visible.sync="setRightDialogVisible"
   width="50%" @close="setRoghtDialogClosed">
   <!--树形控件-->
    <el-tree :data="rightlist" :props="treeProps" show-checkbox node-key="id"
     default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>

<script>
export default{
    data(){
        return{
          //所有角色列表数据
          rolelist: [],
          //控制分配权限对话框的显示与隐藏
          setRightDialogVisible: false,
          //所有权限的数据
          rightslist:[],
          //树形控件的绑定对象
          treeProps:{
            label:'authName',
            children:'children'
          },
          //默认选中的节点Id值数组
          defKeys:[],
          //当前即将分配权限的角色id
          roleId:''

        }
    },
    created(){
        this.getRolesList()
    },
    methods:{
        //获取所有角色的列表
        async getRolesList(){
         const{data: res} = await this.$http.get('roles')

         if(res.meta.status !== 200){
           return this.$message.error('获取角色列表失败！')
         }
         this.rolelist = res.data

         console.log(this.rolelist)
        },

      async removeRightById(role, rightId){
          //弹框提示用户是否要删除

       const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)//捕获用户的取消行为

        if(confirmResult !== 'confirm')  {
          //这种条件语句通常用于处理确认对话框
  //（例如JavaScript中的confirm函数），
  //其中 confirmResult 变量可能包含用户的响应，而 'confirm' 则表示用户点击了"确认"按钮
          return this.$message.info('取消了删除')
        }
       const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)


       if(res.meta.status !== 200){
          return this.$message.error('删除权限失败！')
        }
       // this.getRolesList()//刷新
       role.children = res.data//服务器返回的data重新为角色赋值 防止整个列表的刷新
    },

    //展示分配权限的对话框
    async showSetRightDialog(role){

      this.roleId = role.id
      //获取所有权限的数据
       const {data: res} = await this.$http.get('rights/tree')


      if(res.meta.status !== 200){
          return this.$message.error('获取权限数据失败!')
      }
      //把获取到的权限数据保存到data中
      this.rightlist = res.data
      console.log(this.rightlist)

        //递归获取三级节点的id
        this.getLeafKeys(role, this.defKeys )
      this.setRightDialogVisible = true
    },
    //通过递归的形式，获取角色下所有三级权限的id 并保存到defKeys数组中
    getLeafKeys(node, arr){
      //如果当前node节点不包含当前children属性 则是三级节点
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item=>this.getLeafKeys(item,arr))
    },
    //监听分配权限对话框的关闭事件
    setRoghtDialogClosed(){
      this.defKeys=[]
    },
    //实现了具体的权限分配 首先在点击分配权限这个按钮的时候 立即把当前角色
    //的id先保存到data中 供后续进行使用 然后在点击确实按钮的时候先获取到整个树形结构中
    //那些半选和全选状态下的id值 然后合并为一个完整的数组 紧接着把得到的数组做了一次字符串的拼接
    //用英文的逗号拼接成一个字符串 然后发起一次请求 把刚才保存的角色id还有新拼接出来的id字符串发送到了服务器端
    //刷新角色列表 同时关闭分配权限的对话框
    async allotRights(){
      const keys = [
        //获取所有已选中的id数组 要调方法就要有引用Ref
        //展开运算符（spread operator）允许一个表达式在某处展开 把两个数组合并为一个新数组
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()

      ]
      const idStr = keys.join(',')//拼接字符串

    const{data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})//请求体拼接字符串
     //1.5.6. 角色授权 rids权限 ID 列表（字符串）以 `,` 分割的权限 ID 列表（获取所有被选中、叶子节点的key和半选中节点的key, 包括 1，2，3级节点）
     if(res.meta.status !== 200){

      return this.$message.error('分配权限失败！')
     }
      this.$message.success('分配权限成功')
      this.getRolesList()//刷新列表
      this.setRightDialogVisible = false//把整个对话框隐藏

  }

  }

}
</script>

<style lang="less" scoped>
.el-tag{
  margin:7px;
}

.bdtop{
  border-top:1px solid #eee;
}/*顶边框*/
.bdbottom{
  border-bottom:1px solid
  #eee;
}/*底边框*/

.vcenter{
  display: flex;
  align-items: center;
}

</style>