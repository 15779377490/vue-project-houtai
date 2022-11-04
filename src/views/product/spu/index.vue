<template>
  <div>
    <selectfrom
      @getcategory="getcategory"
      :show="show == 1 ? true : false"
    ></selectfrom>
    <div v-show="show == 1 ? true : false">
      <el-button
        type="primary"
        icon="el-icon-plus"
        style="margin: 5px 10px"
        :disabled="category3Id ? false : true"
        @click="changeshow"
        >添加SPU</el-button
      >
      <el-table border style="width: 100%" :data="allList">
        <el-table-column label="序号" width="180" type="index" align="center">
        </el-table-column>
        <el-table-column label="SPU名称" width="180" prop="spuName">
        </el-table-column>
        <el-table-column label="SPU描述" prop="description"> </el-table-column>
        <el-table-column label="操作" width="350">
          <template slot-scope="{ row, $index }">
            <el-button
              type="success"
              icon="el-icon-plus"
              size="mini"
              @click="getskuid(row)"
            ></el-button>
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="getspubyid(row)"
            ></el-button>
            <el-button
              type="info"
              icon="el-icon-info"
              size="mini"
              @click="changedialog(row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleterow(row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
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
      <el-dialog
        :title="`${spu.spuName}的列表`"
        :visible.sync="dialogTableVisible"
        :before-close="close"
      >
        <el-table :data="skuList" v-loading="loading">
          <el-table-column prop="skuName" label="名称"></el-table-column>
          <el-table-column prop="price" label="价格"></el-table-column>
          <el-table-column prop="weight" label="重量"></el-table-column>
          <el-table-column label="默认图片">
            <template slot-scope="{ row, $index }">
              <img
                :src="row.skuDefaultImg"
                alt=""
                style="width:100px;height100px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
    <div v-show="show == 2 ? true : false">
      <Spuindex
        @changeisshow="changeisshow"
        @uploadsave="getcategoryList(page, limit, category3Id)"
        ref="spu"
      ></Spuindex>
    </div>
    <div v-show="show == 3 ? true : false">
      <Skuindex ref="sku" @changeshow="changeshow"></Skuindex>
    </div>
  </div>
</template>

<script>
import Skuindex from "./skuindex.vue";
import Spuindex from "./spuindex.vue";
export default {
  name: "spu",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      allList: [],
      page: 1,
      limit: 3,
      total: 0,
      show: 1,
      dialogTableVisible: false,
      spu: {},
      skuList: [],
      loading: true,
    };
  },
  components: {
    Spuindex,
    Skuindex,
  },
  methods: {
    // 通过选择slelect获得对应的选项id
    getcategory({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;

        this.getcategoryList(this.page, this.limit, this.category3Id);
      }
    },
    // 通过获取3id传入接口获取相应的数据
    async getcategoryList(page, limit, categoryId) {
      let res = await this.$API.spu.getSpuList(page, limit, categoryId);

      if (res.code == 200) {
        this.allList = res.data.records;
        this.total = res.data.total;
      } else {
        return false;
      }
    },
    // 点击对应的页码获取相应的数据
    handleCurrentChange(pager) {
      this.page = pager;
      this.getcategoryList(this.page, this.limit, this.category3Id);
    },

    handleSizeChange(limit) {
      this.limit = limit;
      this.getcategoryList(this.page, this.limit, this.category3Id);
    },
    // 通过改变show显示spu添加界面
    changeshow() {
      this.show = 2;
      this.$refs.spu.addinfo(this.category3Id);
    },
    //子组件通过emit向父组件发送了一个事件，父组件接受后改变show的状态
    changeisshow() {
      this.show = 1;
    },
    // 通过refs调用子组件的方法传入参数，子组件获取参数发送请求
    getspubyid(row) {
   
      this.show = 2;
      this.$refs.spu.getspubyid(row.id);
    },
    // 删除spu列表
    async deleterow(row) {
      let res = await this.$API.spu.deletespu(row.id);
      if (res.code == 200) {
        this.$message({
          message: "删除成功",
          type: "success",
        });
      }
      this.getcategoryList(this.page, this.limit, this.category3Id);
    },
    // 通过refs调用子组件的方法传入参数，子组件获取参数发送请求
    getskuid(row) {
      this.show = 3;
      this.$refs.sku.getskuid(this.category1Id, this.category2Id, row);
    },
    // changeshow() {
    //   this.show = 1;
    // },
    async changedialog(row) {
      this.dialogTableVisible = true;
      this.spu = row;
      let res = await this.$API.sku.getskuList(row.id);
      console.log(res);
      if (res.code == 200) {
        this.skuList = res.data;
        this.loading = false;
      }
    },
    close(done) {
      this.loading = true;
      this.skuList = [];
      done();
    },
  },
};
</script>

<style></style>
