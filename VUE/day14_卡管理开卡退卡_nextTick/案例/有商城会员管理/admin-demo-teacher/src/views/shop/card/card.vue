<template>
  <div class="page">
    <p-page-header title="会员卡管理"></p-page-header>
    <el-form inline :model="queryForm">
      <el-form-item size="mini" label="会员卡名称">
        <el-input
          placeholder="请输入"
          clearable
          v-model="queryForm.name"
        ></el-input>
      </el-form-item>
      <el-form-item size="mini" label="会员卡编号">
        <el-input
          placeholder="请输入"
          clearable
          v-model="queryForm.num"
        ></el-input>
      </el-form-item>
      <el-form-item size="mini" label="会员卡类型">
        <el-select
          placeholder="请选择"
          clearable
          v-model.trim="queryForm.cardTypeId"
        >
          <el-option
            v-for="item in cardTypeList"
            :key="'' + item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item size="mini">
        <el-button
          type="primary"
          :loading="queryLoading"
          @click="handleClick"
          icon="el-icon-search"
          >查询</el-button
        >
      </el-form-item>
      <el-form-item size="mini">
        <el-button type="success" @click="handleAdd" icon="el-icon-plus"
          >新增</el-button
        >
      </el-form-item>
      <el-form-item size="mini">
        <el-button
          type="success"
          plain
          @click="handleAddMultiple"
          icon="el-icon-plus"
          >批量建卡</el-button
        >
      </el-form-item>
    </el-form>

    <el-table border size="mini" :data="list">
      <el-table-column label="会员卡名称" prop="name"></el-table-column>
      <el-table-column label="会员卡编号" prop="num"></el-table-column>
      <el-table-column label="会员卡logo">
        <template v-slot="{ row }">
          <el-image
            style="width: 100px; height: 100px; border-radius: 9px"
            fit="cover"
            :src="row.logo"
            :preview-src-list="[row.logo]"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="会员卡状态">
        <template v-slot="{ row }">
          <el-tag v-if="row.status == 0" size="small"> 未使用 </el-tag>
          <el-tag v-else type="danger" size="small"> 已发卡 </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="会员卡类型">
        <template v-slot="{ row }">
          <el-tag size="small">
            {{ row.cardTypeName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="会员卡备注" show-overflow-tooltip prop="remark">
      </el-table-column>
      <el-table-column width="300px" label="操作">
        <template v-slot="{ row }">
          <el-button
            size="mini"
            icon="el-icon-edit"
            @click="handleEdit(row.id)"
            type="warning"
            >修改</el-button
          >
          <el-button
            size="mini"
            @click="handleRemove(row.id)"
            icon="el-icon-remove"
            type="danger"
            >删除</el-button
          >
          <el-button
            size="mini"
            icon="el-icon-edit"
            @click="handleOpenCard(row)"
            plain
            type="warning"
            v-if="row.status == 0"
          >
            开卡
          </el-button>
          <el-button
            size="mini"
            icon="el-icon-edit"
            plain
            type="danger"
            v-else
            @click="handleBackCard(row)"
          >
            退卡
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.pno"
      :page-size="page.psize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.totalElements"
    >
    </el-pagination>

    <el-dialog title="绑卡" :visible.sync="dialogVisible" width="600px">
      <el-form ref="dialogForm" :rules="rules" :model="dialogForm">
        <el-form-item label="卡号">
          <el-tag size="mini">
            {{ dialogForm.num }}
          </el-tag>
        </el-form-item>
        <el-form-item prop="userId">
          <!-- begin ++++++++++++++++++++++++++++++++++ -->
          <user-table ref="userTable" v-model="dialogForm.userId"></user-table>
          <!-- end ++++++++++++++++++++++++++++++++++ -->
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button type="primary" size="mini" @click="handleBind"
          >绑定</el-button
        >
        <el-button type="defautl" size="mini" @click="handleCancel"
          >取消</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script>
import UserTable from "./user-table.vue";
// 引入vuex的state和actions的映射对象用来映射store中定义的state和actions
import { mapState, mapActions } from "vuex";

export default {
  // 定义了组件的名称，用来结合keep-alive缓存页面
  name: "card",
  components: {
    UserTable,
  },
  data() {
    return {
      // 调用查询接口需要的参数
      queryForm: {
        name: "",
        cardTypeId: "",
        num: "",
        pno: 1,
        psize: 10,
      },
      // 查询按钮的加载动画开关
      queryLoading: false,
      rules: {
        userId: [
          { required: true, message: "请选择要绑卡的用户", trigger: "change" },
        ],
      },
      dialogVisible: false,
      dialogForm: { num: "", userId: "" },
      userList: [],
    };
  },
  computed: {
    ...mapState("cardModel", ["list", "page", "cardTypeList"]),
    // 格式化日期的计算属性
    formatTime() {
      return function (time) {
        let d = new Date(time);
        return `${d.getFullYear()}-${
          d.getMonth() + 1
        }-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
      };
    },
  },
  // 当第一次打开页面时会执行created生命周期
  async created() {
    await this.getCardTypeListAll();
    await this.getListForPage(this.queryForm);
  },
  // 由于本页通过keep-alive进行了缓存，缓存后原有的生命周期不执行，所以通过activated来识别何时进入本页
  async activated() {
    await this.getCardTypeListAll();
    await this.getListForPage(this.queryForm);
  },
  methods: {
    ...mapActions("cardModel", [
      "getListForPage",
      "deleteById",
      "getCardTypeListAll",
      "open",
      "back",
    ]),
    // 点击查询按钮触发的
    async handleClick() {
      this.queryLoading = true;
      this.queryForm.pno = 1;
      await this.getListForPage(this.queryForm);
      this.queryLoading = false;
    },
    // 点击分页组件的每页多少条切换时会触发这个回调，参数就是切换的条数
    async handleSizeChange(psize) {
      this.queryForm.psize = psize;
      this.queryForm.pno = 1;
      await this.getListForPage(this.queryForm);
    },
    // 点击分页组件上一页下一页切换页面时触发的回调，参数就是跳到哪一页
    async handleCurrentChange(pno) {
      this.queryForm.pno = pno;
      await this.getListForPage(this.queryForm);
    },
    // 跳转到添加数据的页面
    handleAdd() {
      this.$router.push("/card-add");
    },
    async handleRemove(id) {
      // 通过同步化写法调用$confirm方法
      let confirm = await this.$confirm("正在删除", "提示", {
        type: "warning",
      }).catch((err) => err);
      if (confirm == "confirm") {
        // 如果点击确定
        //首先调用删除业务
        await this.deleteById(id);
        //删除业务调用完毕之后我们重新调用一次查询业务，来实现数据的更新
        await this.getListForPage(this.queryForm);
      }
    },
    handleEdit(id) {
      this.$router.push({
        path: "/card-edit",
        query: {
          id,
        },
      });
    },
    handleAddMultiple() {
      this.$router.push("/card-add-multiple");
    },
    async handleOpenCard(row) {
      this.dialogForm.num = row.num;
      this.dialogVisible = true;
      await this.$nextTick();
      this.$refs.userTable.handleClick();
    },
    async handleBackCard(row) {
      let confirm = await this.$confirm(`您是否要退卡号 ${row.num}`, "退卡", {
        confifrmButtonText: "退卡",
        cancelButtonText: "取消",
      }).catch(() => {
        console.log("cancel");
      });
      if (confirm) {
        this.num = row.num;
        await this.back(this.num);
        await this.getListForPage(this.queryForm);
      }
    },
    async handleBind() {
      let valid = await this.$refs.dialogForm.validate().catch((err) => err);
      if (valid) {
        await this.open(this.dialogForm);
        await this.getListForPage(this.queryForm);
        this.dialogVisible = false;
      }
    },
    handleCancel() {
      this.dialogVisible = false;
    },
  },
};
</script>

<style>
</style>
