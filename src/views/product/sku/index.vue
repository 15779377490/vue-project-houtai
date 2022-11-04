<template>
  <div>
    <el-table :data="skuList" style="width: 100%" border>
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="l默认图片" width="width">
        <template slot-scope="{ row, $index }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="width: 80px; height: 80px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80"> </el-table-column>
      <el-table-column prop="price" label="价格" width="80"> </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="success"
            icon="el-icon-sort-down"
            size="mini"
            v-if="row.isSale == 0"
            @click="cancel(row)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-sort-up"
            size="mini"
            v-else
            @click="onsale(row)"
          ></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            @click="skuinfo(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
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
  </div>
</template>

<script>
import { reqskuList } from "@/api/product/sku";
export default {
  name: "sku",
  data() {
    return {
      page: 1,
      limit: 3,
      total: 10,
      skuList: [],
      ckuInfo: {},
    };
  },
  mounted() {
    this.reqskuList(this.page, this.limit);
  },
  methods: {
    async reqskuList(page, limit) {
      let res = await this.$API.sku.reqskuList(page, limit);
      if (res.code == 200) {
        this.total = res.data.total;
        this.skuList = res.data.records;
      }
    },
    handleCurrentChange(pager) {
      this.page = pager;
      this.reqskuList(this.page, this.limit);
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.reqskuList(this.page, this.limit);
    },
    async cancel(row) {
      let res = await this.$API.sku.cancelsale(row.id);
      if (res.code == 200) {
        row.isSale = 1;
        this.$message({
          message: "下架成功!",
          type: "success",
        });
      }
    },
    async onsale(row) {
      let res = await this.$API.sku.onsale(row.id);
      if (res.code == 200) {
        row.isSale = 0;
        this.$message({
          message: "上架成功!",
          type: "success",
        });
      }
    },
    async skuinfo(sku) {
      let res = await this.$API.sku.reqSkuById(sku.id);
      console.log(res);
      if (res.code == 200) {
        this.skuInfo = res.data;
      }
    },
  },
};
</script>

<style></style>
