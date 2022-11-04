<template>
  <div class="all">
    <el-form :model="spu">
      <el-form-item label="SPU名称:" label-width="100px">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌" label-width="100px">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            v-for="(item, index) in TradeMarkList"
            :key="item.id"
            :label="item.tmName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述" label-width="100px">
        <el-input
          type="textarea"
          placeholder="SPU描述"
          rows="4"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="图片" label-width="100px">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="this.handlesuccess"
          :file-list="ImageList"
          :show-file-list="true"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性" label-width="100px">
        <el-select
          v-model="attrIdAndName"
          :placeholder="`还有${this.spuattrlist.length}未选中`"
        >
          <el-option
            v-for="(item, index) in this.spuattrlist"
            :key="item.id"
            :label="item.name"
            :value="`${item.id}:${item.name}`"
          ></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" @click="pushAttr"
          >添加销售属性</el-button
        >
      </el-form-item>
      <el-form-item label="" label-width="100px">
        <el-table
          border
          style="width: 100%; margin: 20px 0"
          :data="spu.spuSaleAttrList"
        >
          <el-table-column label="序号" width="180" type="index" align="center">
          </el-table-column>
          <el-table-column label="属性名" width="180" prop="saleAttrName">
          </el-table-column>
          <el-table-column label="属性值名称列表">
            <template slot-scope="{ row, $index }">
              <el-tag
                closable
                :disable-transitions="false"
                v-for="(item, index) in row.spuSaleAttrValueList"
                :key="item.id"
                @close="handleClose(row, item.saleAttrValueName)"
              >
                {{ item.saleAttrValueName }}</el-tag
              >

              <el-input
                ref="saveTagInput"
                class="input-new-tag"
                v-show="row.inputVisible"
                v-model="inputValue"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>

              <el-button
                class="button-new-tag"
                size="small"
                @click="showInput(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="350">
            <template slot-scope="{ row, $index }">
              <el-button
                type="success"
                icon="el-icon-plus"
                size="mini"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
              ></el-button>
              <el-button
                type="info"
                icon="el-icon-info"
                size="mini"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleterow($index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="" label-width="100px">
        <el-button type="primary" @click="saveall">保存</el-button>
        <el-button type="primary" @click="changeshow">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Message } from "element-ui";
export default {
  name: "spuindex",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      attrIdAndName: "",
      TradeMarkList: [],
      ImageList: [],
      AttrList: [],
      inputValue: "",
      inputVisible: false,

      spu: {
        tmId: "",
        category3Id: "",
        description: "",
        spuName: "",
        spuImageList: [],
        spuSaleAttrList: [],
      },
    };
  },
  methods: {
    handleRemove(file, fileList) {
      this.ImageList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handlesuccess(response, file, fileList) {
      this.ImageList = fileList;
    },
    changeshow() {
      this.$emit("changeisshow");
      // 可以通过合并对象重置data,this._data包括了所有的响应式数据,this.$options.data包括了当前组件的data数据
      Object.assign(this._data, this.$options.data());
    },
    async getspubyid(Id) {
      let res = await this.$API.spu.getspubyid(Id);
      if (res.code == 200) {
        this.spu = res.data;
      }
      let res1 = await this.$API.spu.getTradeMark();
      if (res1.code == 200) {
        this.TradeMarkList = res1.data;
      }
      let res2 = await this.$API.spu.getimageList(Id);
      if (res2.code == 200) {
        let listarr = res2.data;
        listarr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });

        this.ImageList = listarr;
      }
      let res3 = await this.$API.spu.getSale();
      if (res3.code == 200) {
        this.AttrList = res3.data;
      }
    },
    pushAttr() {
   
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndName.split(":");
      let newobj = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] };
      let arr = Object.assign([], this.spu.spuSaleAttrList).map((item) => {
        return Object.assign({}, item);
      });

      let tt = arr.some((item) => {
        return item.saleAttrName == saleAttrName;
      });

      if ((!saleAttrName && this.spuattrlist.length == 0) || tt) {
        this.$message({
          message: "属性值添加错误",
          type: "warning",
        });
        return false;
      }
      this.spu.spuSaleAttrList.push(newobj);
    },
    // 删除spu属性
    handleClose(row, item) {
      row.spuSaleAttrValueList.splice(row.spuSaleAttrValueList.indexOf(item));
    },
    handleInputConfirm(row) {
      let baseSaleAttrId = row.baseSaleAttrId;

      let inputValue = this.inputValue;

      if (inputValue.trim() == "") {
        this.$message({
          message: "请输入内容",
          type: "warning",
        });

        return false;
      }
      if (inputValue) {
        let newobj = { baseSaleAttrId, saleAttrValueName: inputValue };
        let arr = Object.assign([], row.spuSaleAttrValueList).map((item) => {
          return Object.assign({}, item);
        });

        let tt = arr.some((item) => {
          return item.saleAttrValueName == newobj.saleAttrValueName;
        });
        console.log(tt);
        if (tt) {
          this.$message({
            message: "请不要输入相同的属性值",
            type: "warning",
          });
          return false;
        }
        row.spuSaleAttrValueList.push(newobj);
      }
      row.inputVisible = false;
      this.inputValue = "";
    },
    showInput(row) {
      this.$set(row, "inputVisible", true);
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    deleterow(index) {
      this.spu.spuSaleAttrList.splice(index, 1);
    },
    async saveall() {
      this.spu.spuImageList = this.ImageList.map((item) => {
        return {
          imageName: item.name,
          imageUrl: (item.response && item.response.data) || item.url,
        };
      });
      JSON.parse(JSON.stringify(this.spu.spuImageList));
      console.log(this.spu.spuImageList);
      let res = await this.$API.spu.getsaveorupdate(this.spu);
      if (res.code == 200) {
        this.$message({
          message: "修改成功",
          type: "success",
        });
        this.$emit("changeisshow");
        this.$emit("uploadsave");
        Object.assign(this._data, this.$options.data());
      }
    },
    async addinfo(category3Id) {
      this.spu.category3Id = category3Id;
      let res1 = await this.$API.spu.getTradeMark();
      if (res1.code == 200) {
        this.TradeMarkList = res1.data;
      }
      let res3 = await this.$API.spu.getSale();
      if (res3.code == 200) {
        this.AttrList = res3.data;
      }
    },
  },
  computed: {
    spuattrlist() {
      let result = this.AttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
      let newarr = Object.assign([], result).map((item) => {
        return Object.assign({}, item);
      });

      return newarr;
    },
  },
};
</script>

<style>
.all {
  padding: 20px 20px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
