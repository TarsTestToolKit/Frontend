<template>
  <div class="functional">
    <!-- 标题 -->
    <h1>Functional Test</h1>
    <!-- 开始函数测试按钮 -->
    <el-button type="primary" @click="doFuncTest" plain>doFuncTest</el-button>
    <br>
    <div v-loading="loading.status">
        <!-- 无数据时 -->
        <el-empty description="No Data" v-if="DoFuncTestresult.code==-1"></el-empty>
        <!-- 有数据时 -->
        <!-- 自适应栅格 -->
        <el-row >
          <el-col :span="1"></el-col>
          <el-col :span="22">
            <el-card class="box-card" shadow="always" v-if="DoFuncTestresult.code!=-1">
              <div  class="text item">
                <div v-for="item in DoFuncTestresult.rows" :key="item.key" style="padding-top:20px">
                    <el-tag type="success" v-if="item.isSucc==true">{{item.from}} -> {{item.to}} : Succeed</el-tag>
                    <el-tag type="danger" v-if="item.isSucc==false">{{item.from}} -> {{item.to}} : Fail</el-tag>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="1"></el-col>
        </el-row>
    </div>
    
  </div>
</template>
<script lang="ts">
//引入axios
import axios from 'axios'
import { reactive } from "vue";
//函数测试接口定义
interface DoFuncTestModelRef {
  code: number,
  msg: string,
  rows:any
}
export default ({
  setup() {
    // 定义加载状态
    const loading = reactive({ 
      status: false 
    })
    // 定义函数测试结果
    const DoFuncTestresult: DoFuncTestModelRef = reactive<DoFuncTestModelRef>({
      code: -1,
      msg: '',
      rows: ''
    })
    //开始函数测试按钮
    const  doFuncTest = async () => {
      loading.status=true
      try {
        const response = await axios.post('/api/testFunc');
        console.log(response);
        DoFuncTestresult.code=response.data.code
        DoFuncTestresult.msg=response.data.msg
        DoFuncTestresult.rows=response.data.rows
      } catch (error) {
        //console.log(error.message);
        //console.log(error.code);
        DoFuncTestresult.code=error.code
        DoFuncTestresult.msg=error.message
        DoFuncTestresult.rows=error.rows
      }
      loading.status=false
    }
    return {
      doFuncTest,
      DoFuncTestresult,
      loading
    }
  }
});
</script>
<style scoped>
  .functional{
    text-align: center;
  }
  /* 左对齐 */
  .box-card{
    padding-top: 20px;
    text-align: left;
  }
</style>