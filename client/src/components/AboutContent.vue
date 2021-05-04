<template>
  <div class="about">
    <h1>About</h1>
    <el-row >
      <el-col :span="24">
        <el-card class="box-card" shadow="hover">
          <div  class="text item">
            Development-ENV:
            <el-tag>Vue3</el-tag>
            <el-tag type="success">TypeScript</el-tag>
            <el-tag type="info">ElementPlus</el-tag>
            <el-tag type="warning">TSlint</el-tag>
            <el-tag type="danger">Axios</el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AboutContent",
  props: {
    msg: String,
  },
});
</script>

<style scoped>
.el-tag {
  margin-left: 10px;
}
.about {
  text-align: center;
}
</style>
