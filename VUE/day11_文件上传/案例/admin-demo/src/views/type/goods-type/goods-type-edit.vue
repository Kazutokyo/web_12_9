<template>
  <div class="page">
    <el-page-header @back="handleBack" content="编辑商品信息"></el-page-header>
    <el-row>
      <el-col :span="6">
        <el-form
          :model="addForm"
          label-width="auto"
          ref="addForm"
          :rules="rules"
        >
          <el-form-item size="mini" prop="name" label="商品类型">
            <el-input
              placeholder="请输入"
              clearable
              v-model.trim="addForm.name"
            ></el-input>
          </el-form-item>
          <el-form-item size="mini" prop="remark" label="商品备注">
            <el-input
              placeholder="请输入"
              clearable
              v-model.trim="addForm.remark"
            ></el-input>
          </el-form-item>

          <el-form-item size="mini">
            <el-button @click="handleAdd" type="primary">提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    {{ addForm }}
  </div>
</template>

<script>
import {
  getGoodsTypeById,
  updateGoodsType,
} from "../../../api/goods-type-api";
export default {
  data() {
    return {
      // 调用查询接口需要的参数
      addForm: {
        id: "",
        name: "",
        remark: "",
      },
      rules: {
        name: [{ required: true, message: "商品名称不可为空" }],
      },
    };
  },
  methods: {
    async handleAdd() {
      let isValid = this.$refs.addForm.validate().catch((e) => e);
      if (isValid) {
        await updateGoodsType(this.addForm);
        this.handleBack();
      }
    },
    handleBack() {
      this.$router.history.go(-1);
    },
  },
  async created() {
    let id = this.$route.query.id;
    let addForm = await getGoodsTypeById(id);
    this.addForm = addForm.data.data;
  },
};
</script>

<style>
</style>