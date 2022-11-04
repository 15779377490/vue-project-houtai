<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showdialog"
      >添加</el-button
    >
    <el-dialog title="添加商品" :visible.sync="dialogFormVisible">
      <el-form :model="tmFrom">
        <el-form-item
          label="品牌名称:"
          label-width="100px"
          center="false"
          prop="tmName"
        >
          <el-input autocomplete="off" v-model="tmFrom.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmFrom.logoUrl" :src="tmFrom.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            dialogFormVisible = false;
            addtrademark(tmFrom);
          "
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-table
      style="width: 100%"
      border
      :data="recodes"
      :rule="rules"
      ref="rulefrom"
    >
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="品牌LOGO" width="width">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="height: 100px; width: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updatetrademark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deletetrademark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- @size-change="handleSizeChange"
        @current-change="handleCurrentChange" -->
    <el-pagination
      style="text-align: center; margin-top: 20px"
      :current-page="this.page"
      :page-sizes="[3, 5, 10]"
      :page-size="this.limit"
      layout=" prev, pager, next, jumper, ->,sizes,total"
      :total="this.total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    return {
      page: 1,
      limit: 3,
      pages: "",
      total: 0,
      recodes: [],
      dialogFormVisible: false,
      imageUrl: "",
      tmFrom: {
        tmName: "",
        logoUrl: "",
      },
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        logoUrl: [
          { required: true, message: "请选择logo图片", trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    this.gettrademark(this.page, this.limit);
  },
  methods: {
    // 当第一次加载页面时，传入初始值展示的页数和每页展示的条数，获取数据
    async gettrademark(page, limit) {
      let res = await this.$API.trademark.gettrademark(page, limit);
      if (res.code == 200) {
        this.recodes = res.data.records;
        this.pages = res.data.pages;
        this.total = res.data.total;
        this.limit = res.data.size;
      }
    },
    // 当点击页数传入相应的页数显示相应的数据
    handleCurrentChange(pager) {
      this.page = pager;
      this.gettrademark(this.page, this.limit);
    },
    // 当点击选择每页展示的数据相应的显示多少数据
    handleSizeChange(limit) {
      this.limit = limit;
      this.gettrademark(this.page, this.limit);
    },
    // 控制显示相应的添加页面的组件是否显示并且初始化表格
    showdialog() {
      this.dialogFormVisible = true;
      this.tmFrom = {
        tmName: "",
        logoUrl: "",
      };
    },
    // 获取传入图片的地址
    handleAvatarSuccess(res, file) {
      this.tmFrom.logoUrl = URL.createObjectURL(file.raw);
    },
    // 得到图片的格式和大小进行筛选以及判断
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 通过制定的校验规则，使用validate返回一个判断完成的promise得到结果进行判断显示弹窗
    addtrademark(tmFrom) {
      this.$refs.rulefrom.validate(async (success) => {
        if (success) {
          let res = await this.$API.trademark.addtrademark(tmFrom);
          if (res.code == 200) {
            this.$message({
              message: this.tmFrom.id ? "修改品牌成功!" : "添加品牌成功!",
              type: "success",
            });
            this.gettrademark(this.page, this.limit);
          }
        } else {
          return false;
        }
      });
    },
    updatetrademark(row) {
      this.dialogFormVisible = true;
      this.tmFrom = { ...row };
    },
    deletetrademark(row) {
      this.$confirm(`是否删除${row.tmName}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await this.$API.trademark.deletetrademark(row.id);
          console.log(res);
          if (res.code == 200) {
            console.log(1);
            this.$message({
              type: "success",
              message: "删除成功!",
            });

            this.gettrademark(
              this.recodes.length > 1 ? this.page : this.page - 1,
              this.limit
            );
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
