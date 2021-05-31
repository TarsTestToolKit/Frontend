<template>
  <el-container>
    <!-- 顶部导航 -->
    <el-header style="border-bottom: 1px solid #dcdfe6">
      <el-row>
        <el-col :span="4">
          <router-link to="/"
            ><img src="@/assets/tars.png" style="height: 50px"
          /></router-link>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
        <router-view />
    </el-main>
  </el-container>
</template>
<script lang="ts">
export default {
  setup() {
    const handleOpen = (key: any, keyPath: any) => {
      console.log(key, keyPath);
    };
    const handleClose = (key: any, keyPath: any) => {
      console.log(key, keyPath);
    };
    const handleSelect = (key: any, keyPath: any) => {
      console.log(key, keyPath);
    };
    return {
      handleOpen,
      handleClose,
      handleSelect,
    };
  },
};
</script>
<style scoped>
.el-table__header col[name="gutter"] {
  display: table-cell !important;
}
.el-main {
  height: calc(100vh - 80px);
}
.el-aside {
  height: calc(100vh - 80px);
  background-color: #FFF;
}
.el-menu-item {
  background-color: #FFF;
}
.el-menu-item.is-active {
  color: #409eff;
  background-color: #E7F4FF;
}
.el-main {
  background-color: #F6F8F9;
}
.el-main::-webkit-scrollbar,
.el-aside::-webkit-scrollbar,
.el-table {
  width: 10px;
  height: 1px;
}
.el-main::-webkit-scrollbar-thumb,
.el-aside::-webkit-scrollbar {
  border-radius: 10px;
  background-color: skyblue;
  background-image: -webkit-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.2) 75%,
    transparent 75%,
    transparent
  );
}
.el-main::-webkit-scrollbar-track,
.el-aside::-webkit-scrollbar {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #ededed;
  border-radius: 10px;
}
</style>
