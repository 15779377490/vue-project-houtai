<template>
  <div>
    <el-form ref="form">
      <el-form-item label="SKU名称" label-width="80px">
        {{ spu.spuName }}
      </el-form-item>
      <el-form-item label="SKU名称" label-width="80px">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)" label-width="80px">
        <el-input
          placeholder="价格(元)"
          type="number"
          v-model="skuInfo.price"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)" label-width="80px">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述" label-width="80px">
        <el-input
          type="textarea"
          placeholder="规格描述"
          rows="4"
          v-model="skuInfo.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性" label-width="80px">
        <el-form ref="form" label-width="80px" :inline="true">
          <el-form-item
            :label="item.attrName"
            v-for="(item, index) in AttrInfoList"
            :key="item.id"
          >
            <el-select placeholder="请选择" v-model="item.saleattr">
              <el-option
                :label="item1.valueName"
                v-for="(item1, index) in item.attrValueList"
                :key="item1.id"
                :value="`${item.id}:${item1.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性" label-width="80px">
        <el-form :inline="true" label-width="80px">
          <el-form-item
            :label="item.saleAttrName"
            v-for="(item, index) in saleAttrList"
            :key="item.id"
          >
            <el-select
              placeholder="请选择"
              label-width="80px"
              v-model="item.attrIdandValueId"
            >
              <el-option
                :label="item1.saleAttrValueName"
                v-for="(item1, index) in item.spuSaleAttrValueList"
                :key="item1.id"
                :value="`${item.id}:${item1.id}`"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表" label-width="80px">
        <el-table
          style="width: 100%"
          border
          :data="skuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            prop="prop"
            label="label"
            width="80px"
          >
          </el-table-column>
          <el-table-column prop="prop" label="图片">
            <template slot-scope="{ row, $index }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称"> </el-table-column>
          <el-table-column prop="prop" label="操作">
            <template slot-scope="{ row, $index }">
              <el-button
                type="primary"
                v-if="row.isDefault == 0"
                @click="changeDefault(row)"
                >设置默认</el-button
              >
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveskuInfo">保存</el-button>
        <el-button @click="changeshow">取消</el-button>
      </el-form-item>
    </el-form>
   
  </div>
</template>

<script>
export default {
  name: "skuindex",
  data() {
    return {
      skuImageList: [],
      saleAttrList: [],
      AttrInfoList: [],
      skuInfo: {
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        skuAttrValueList: [],
        skuDefultImg: "",
        skuImageList: [],
        skuSaleAttrValueList: [],
      },
      spu: {},
      ImageList: [],

    };
  },
  methods: {
    async getskuid(category1Id, category2Id, row) {
      this.spu = row;
      this.skuInfo.category3Id = row.category3Id;
      this.skuInfo.tmId = row.tmId;
      this.skuInfo.spuId = row.id;
      let res = await this.$API.sku.getspuImageList(row.id);
      if (res.code == 200) {
        this.skuImageList = res.data;
        this.skuImageList.forEach((item) => {
          this.$set(item, "isDefault", 0);
        });
      }

      let res1 = await this.$API.sku.getspusaleAttr(row.id);
      if (res1.code == 200) {
        this.saleAttrList = res1.data;
      }
      let res2 = await this.$API.sku.getAttrInfo(
        category1Id,
        category2Id,
        row.category3Id
      );
      if (res2.code == 200) {
        this.AttrInfoList = res2.data;
      }
    },
    changeshow() {
      this.$emit("changeshow");
      Object.assign(this._data, this.$options.data());
    },
    handleSelectionChange(val) {
      this.ImageList = val;
    },
    changeDefault(row) {
      this.skuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      this.skuInfo.skuDefultImg = row.imgUrl;
    },
    async saveskuInfo() {
      let arr = [];
      const { AttrInfoList, skuInfo, saleAttrList } = this;

      AttrInfoList.forEach((item) => {
        if (item.saleattr) {
          const [attrId, valueId] = item.saleattr.split(":");
          let obj = { attrId, valueId };
          arr.push(obj);
        }
      });
      skuInfo.skuAttrValueList = arr;
      let arr1 = [];
      saleAttrList.forEach((item) => {
        if (item.attrIdandValueId) {
          const [saleAttrValueId, saleAttrId] =
            item.attrIdandValueId.split(":");
          let obj = { saleAttrId, saleAttrValueId };
          arr1.push(obj);
        }
      });
      skuInfo.skuSaleAttrValueList = arr1;
      skuInfo.skuImageList = this.ImageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      let res = await this.$API.sku.saveSkuInfo(skuInfo);
      if (res.code == 200) {
        this.$emit("changeshow");
        this.$message({
          message: "保存成功",
          type: "success",
        });
        Object.assign(this._data, this.$options.data());
      }
    },
  },
};
</script>

<style></style>
