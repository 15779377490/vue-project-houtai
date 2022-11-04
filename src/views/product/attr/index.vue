<template>
  <div>
    <selectfrom @getcategory="getcategory" :show="isshow"></selectfrom>
    <div v-show="isshow">
      <el-button
        type="primary"
        icon="el-icon-plus"
        style="margin: 5px 10px"
        @click="changeshow"
        :disabled="category3Id ? false : true"
        >添加</el-button
      >
      <el-table border style="width: 100%" :data="this.allList">
        <el-table-column label="序号" width="180" type="index" align="center">
        </el-table-column>
        <el-table-column label="属性" width="180" prop="attrName">
        </el-table-column>
        <el-table-column label="属性值列表">
          <template slot-scope="{ row, $index }">
            <el-tag
              type="success"
              v-for="(item, index) in row.attrValueList"
              :key="item.id"
              style="margin: 0px 10px"
              >{{ item.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="{ row, $index }">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="updateshow(row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="!isshow">
      <el-form ref="form" label-width="80px" :model="attrInfo">
        <el-form-item label="属性名">
          <el-input
            placeholder="颜色"
            style="width: 200px"
            v-model="attrInfo.attrName"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        icon="el-icon-plus"
        style="margin: 5px 10px"
        @click="addattrList"
        :disabled="attrInfo.attrName == '' ? true : false"
        >添加属性值</el-button
      >

      <el-table border style="width: 100%" :data="attrInfo.attrValueList">
        <el-table-column label="序号" width="180" type="index" align="center">
        </el-table-column>
        <el-table-column label="属性值名称" align="center" prop="valueName">
          <template slot-scope="{ row, $index }">
            <el-input
              v-model="attrInfo.attrValueList[$index].valueName"
              placeholder="请输入属性值"
              v-if="row.ishave"
              @blur="leavblur(row)"
              @keyup.native.enter="row.ishave = false"
              v-focus
            ></el-input>
            <span
              v-else
              @click="row.ishave = true"
              style="padding: 10px 50px"
              >{{ attrInfo.attrValueList[$index].valueName }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{ row, $index }">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteattrList($index)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        type="primary"
        style="margin: 5px 10px"
        :disabled="attrInfo.attrName == '' ? true : false"
        @click="save"
        >保存</el-button
      >
      <el-button @click="reset">取消</el-button>
    </div>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      allList: [],
      isshow: true,
      attrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      },
    
    };
  },
  methods: {
    getcategory({ categoryId, level }) {
      console.log(categoryId);
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;

        this.getcategoryList(
          this.category1Id,
          this.category2Id,
          this.category3Id
        );
      }
    },
    async getcategoryList(category1Id, category2Id, category3Id) {
      let res = await this.$API.attr.getcategory(
        category1Id,
        category2Id,
        category3Id
      );
      console.log(res);
      if (res.code == 200) {
        this.allList = res.data;
      } else {
        return false;
      }
    },
    changeshow() {
      this.isshow = false;
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      };
    },
    addattrList() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        ishave: false,
      });
    
    },
    deleteattrList(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    updateshow(row) {
      this.isshow = false;
      this.attrInfo = cloneDeep(row);
  
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "ishave", false);
      });
    },
    reset() {
      this.isshow = true;
   
    },
    leavblur(row) {
      if (row.valueName.trim() == "") {
        this.$message("请输入一个正确的属性值");
        return;
      }
      let repeat = this.attrInfo.attrValueList.some((item) => {
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (repeat) {
        this.$message("请输入一个不重复的属性值");
        return;
      }
      row.ishave = false;
    },
    async save() {
    
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          if (item.valueName != "") {
            delete item.ishave;
            return true;
          }
        }
      );
      try {
        let res = await this.$API.attr.saveattrInfo(this.attrInfo);
        this.$message({ type: "success", message: "保存成功" });
        this.isshow = true;
        this.getcategoryList(
          this.category1Id,
          this.category2Id,
          this.category3Id
        );
      } catch (error) {
        this.$message({ type: "faile", message: "保存失败" });
      }
    },
  },
};
</script>

<style></style>
