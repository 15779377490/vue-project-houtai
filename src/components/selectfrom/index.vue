<template>
  <el-form
    ref="ruleForm"
    label-width="100px"
    class="demo-ruleForm"
    :inline="true"
    :model="cFrom"
  >
    <el-form-item label="一级分类">
      <el-select
        placeholder="请选择"
        v-model="cFrom.category1Id"
        @change="getcategory2"
        :disabled="!show"
      >
        <el-option
          :label="item1.name"
          :value="item1.id"
          v-for="(item1, index) in list"
          :key="item1.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类">
      <el-select
        placeholder="请选择"
        v-model="cFrom.category2Id"
        @change="getcategory3"
        :disabled="!show"
      >
        <el-option
          :label="item2.name"
          :value="item2.id"
          v-for="(item2, index) in list1"
          :key="item2.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="三级分类">
      <el-select
        placeholder="请选择"
        v-model="cFrom.category3Id"
        @change="getcategory4"
        :disabled="!show"
      >
        <el-option
          :label="item3.name"
          :value="item3.id"
          v-for="(item3, index) in list2"
          :key="item3.id"
        ></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "selectfrom",
  mounted() {
    this.getcategory1();
  },
  props: ["show"],
  data() {
    return {
      list: [],
      list1: [],
      list2: [],
      cFrom: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  methods: {
    async getcategory1() {
      let res = await this.$API.attr.getcategory1();

      if (res.code == 200) {
        this.list = res.data;
      } else {
        return false;
      }
    },
    async getcategory2() {
      this.list1 = [];
      this.list2 = [];
      this.cFrom.category2Id = "";
      this.cFrom.category3Id = "";

      let res = await this.$API.attr.getcategory2(this.cFrom.category1Id);
      if (res.code == 200) {
        this.list1 = res.data;
        this.$emit("getcategory", {
          categoryId: this.cFrom.category1Id,
          level: 1,
        });
      } else {
        return false;
      }
    },
    async getcategory3() {
      this.list2 = [];
      this.cFrom.category3Id = "";
      let res = await this.$API.attr.getcategory3(this.cFrom.category2Id);

      if (res.code == 200) {
        this.$emit("getcategory", {
          categoryId: this.cFrom.category2Id,
          level: 2,
        });
        this.list2 = res.data;
      } else {
        return false;
      }
    },
    getcategory4() {
      this.$emit("getcategory", {
        categoryId: this.cFrom.category3Id,
        level: 3,
      });
    },
  },
};
</script>

<style></style>
