<template>
  <div class="detail">
  <h1>Performance Test</h1>
  <el-button type="primary" @click="StartBenchmark" plain>StartBenchmark</el-button>
  <div v-loading="loading.status" height="200px">
      <!-- 无数据时 -->
      <el-empty description="No Data" v-if="GetTestDetailResult.code==-1"></el-empty>
      <!-- 有数据时 -->
      <!-- 自适应栅格 -->
      <el-row >
        <el-col :span="1"></el-col>
        <el-col :span="22">
          <div v-if="GetTestDetailResult.code!=-1">
            <el-row style="margin-top:20px">
              <el-radio-group v-model="radio">
                <el-radio label="1" border>Detailed indicators</el-radio>
                <el-radio label="2" border>Interval distribution</el-radio>
              </el-radio-group>
            </el-row>

            <el-table v-loading="loading.status" v-show="radio=== '1'" :data="tableDataDetail.data" border style="width: 100%;margin-top:20px" :header-cell-style="{background:'#F9FAFC'}">
              <el-table-column prop="timeStr" label="timeStr" min-width="180"> </el-table-column>
              <el-table-column prop="qps" label="qps"> </el-table-column>
              <el-table-column prop="totalReq" label="totalReq"> </el-table-column>
              <el-table-column prop="succ" label="succ"> </el-table-column>
              <el-table-column prop="failed" label="failed"> </el-table-column>
              <el-table-column prop="succRate" label="succRate"> </el-table-column>
              <el-table-column prop="costMax" label="costMax"> </el-table-column>
              <el-table-column prop="costMin" label="costMin"> </el-table-column>
              <el-table-column prop="costAvg" label="costAvg"> </el-table-column>
              <el-table-column prop="p90" label="p90"> </el-table-column>
              <el-table-column prop="p99" label="p99"> </el-table-column>
              <el-table-column prop="p999" label="p999"> </el-table-column>
              <el-table-column prop="sendByte" label="sendByte"> </el-table-column>
              <el-table-column prop="recvByte" label="recvByte"> </el-table-column>
            </el-table>
              
            <!-- <el-row v-show="radio=== '2'">
              <div id="container"></div>
              <div id="container1"></div>
            </el-row> -->
          </div>
        </el-col>
        <el-col :span="1"></el-col>
      </el-row>
  </div>
  <!-- <div style="margin: 20px;">
    <el-row>
      <el-button type="success" @click="StartButton">Start</el-button>
    </el-row>
    
  </div> -->

  <!-- 开始测试表单 -->
  <!-- <el-dialog title="Configure" v-model="dialogFormVisible.data" center top="8vh" width="580px">
    <el-form :model="startform" ref="PerfTestReqruleForm" :rules="startformrules" label-position="right" label-width="360px">
      <el-form-item label="lang" :label-width="formLabelWidth" prop="lang">
        <el-select v-model="startform.lang" placeholder="Please select lang">
          <el-option label="golang" value="golang"></el-option>
          <el-option label="java" value="java"></el-option>
          <el-option label="cpp" value="cpp"></el-option>
          <el-option label="nodejs" value="nodejs"></el-option>
          <el-option label="php" value="php"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="servType" :label-width="formLabelWidth" prop="servType">
        <el-input v-model="startform.servType" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="threadCnt" :label-width="formLabelWidth" prop="threadCnt">
        <el-input v-model="startform.threadCnt" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="cores" :label-width="formLabelWidth" prop="cores">
        <el-input v-model="startform.cores" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="connCnt" :label-width="formLabelWidth" prop="connCnt">
        <el-input v-model="startform.connCnt" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="reqFreq" :label-width="formLabelWidth" prop="reqFreq">
        <el-input v-model="startform.reqFreq" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="keepAlive(s)" :label-width="formLabelWidth" prop="keepAlive">
        <el-input v-model="startform.keepAlive" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="packageLen" :label-width="formLabelWidth" prop="packageLen">
        <el-select v-model="startform.packageLen" placeholder="Please select packageLen">
          <el-option label="0K" :value="0"></el-option>
          <el-option label="1K" :value="1*1024"></el-option>
          <el-option label="10K" :value="10*1024"></el-option>
          <el-option label="100K" :value="100*1024"></el-option>
          <el-option label="1M" :value="1024*1024"></el-option>
          <el-option label="5M" :value="5*1024*1024"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="GetTestDetail">GetDataDemo</el-button>
        <el-button @click="dialogFormVisible.data = false">Cancel</el-button>
        <el-button type="primary" @click="submitForm">OK</el-button>
        <el-button @click="resetForm">Reset</el-button>
      </span>
    </template>
  </el-dialog> -->
  </div>
</template>
<script lang="ts">
import axios from 'axios'
import { useRouter } from 'vue-router';
import { getCurrentInstance, reactive,ref,unref} from "vue";
import { Pie } from '@antv/g2plot';
interface PerfTestReqModelRef {
  lang: string,
  servType: string,
  threadCnt?: number,
  cores?: number,
  connCnt?: number,
  reqFreq?: number,
  keepAlive?: number,
  packageLen?: number
}
//初始化框架接口
interface GetTestDetailModelRef {
  code: number,
  msg: string,
  testType:string,
  histories:any,
  resUsage:any,
  funcDetail:any
}
export default({
  setup(props: any,context:any) {
    console.log(props)
    console.log(context)
      const router = useRouter();
      console.log(router)
      const { ctx }: any = getCurrentInstance();
      const PerfTestReqruleForm = ref<any>(null);
      // 定义变量
      const startform: PerfTestReqModelRef = reactive<PerfTestReqModelRef>({
        lang: 'golang',
        servType: 'testperf',
        packageLen:0,
        threadCnt: 1,
        cores: 1,
        connCnt: 1,
        reqFreq: 1,
        keepAlive: 10
        // packageLen: ''
      })
      //正整数验证
      const integer= async(rule: any, value: string, callback: any): Promise<void> => {
   　　   const boolean = new RegExp('^[1-9][0-9]*$').test(value)
  　　     //console.log(boolean)
  　　    if (!boolean) {
    　　    callback(new Error('Please enter a positive integer'));
    　　  }else{
            callback();
          }
   　　 }
      //正整数与0验证
      const integer0= async(rule: any, value: string, callback: any): Promise<void> => {
   　　   const boolean = new RegExp('^[1-9][0-9]*$').test(value)
          const iszero= Number(value)===0?true:false
          if(boolean||iszero){
            callback();
          }else{
            callback(new Error('Please enter a positive integer or zero'));
          }
   　　 }
      // 定义验证规则
      const startformrules = {
        servName: [
          { required: true, message: 'Please select a service name', trigger: 'change' },
          { type: 'string',"min": 1, message: 'The content type is string', trigger: 'blur' }
        ],
        servType: [
          { required: true, message: 'Please fill in the server type: hardware description', trigger: 'blur' },
          { type: 'string',"min": 1, message: 'The content type is string', trigger: 'blur' }
        ],
        threadCnt: [
          { required: true, message: 'Please fill in the number of server threads', trigger: 'blur' },
          { type: 'number', trigger: 'blur',validator: integer }
        ],
        cores: [
          { required: true, message: 'Please fill in the server audit', trigger: 'blur'},
          { type: 'number', trigger: 'blur',validator: integer }
        ],
        connCnt: [
          { required: true, message: 'Please fill in the number of node connections', trigger: 'blur'},
          { type: 'number', trigger: 'blur',validator: integer }
        ],
        reqFreq: [
          { required: true, message: 'Please fill in the connection request rate', trigger: 'blur'},
          { type: 'number', trigger: 'blur',validator: integer }
        ],
        keepAlive: [
          { required: true, message: 'Please fill in the number of seconds for pressure measurement', trigger: 'blur'},
          { type: 'number', trigger: 'blur',validator: integer }
        ],
        packageLen: [
          { required: true, message: 'Please select the package size', trigger: 'change' },
          { type: 'number', trigger: 'change',validator: integer0 }
        ]
      }

      // 确认
      const submitForm = () => {
        try {
          (PerfTestReqruleForm.value as any).validate( async (valid: boolean) => {
            if (valid) {
              console.log(startform)
              loading.status=true
              try {
                const response = await axios.post('http://3tkapi.zhaoguolei.com:8000/testPerf',{
                  lang: startform.lang,
                  servType: startform.servType,
                  threadCnt:startform.threadCnt,
                  cores: startform.cores,
                  connCnt: startform.connCnt,
                  reqFreq: startform.reqFreq,
                  keepAlive: startform.keepAlive,
                  packageLen:startform.packageLen
                });
                console.log(response);
                //DoFuncTestresult.code=response.data.code
                //DoFuncTestresult.msg=response.data.msg
                //DoFuncTestresult.rows=response.data.rows
              } catch (error) {
                console.log(error.message);
                console.log(error.code);
                //DoFuncTestresult.code=error.code
                //DoFuncTestresult.msg=error.message
                //DoFuncTestresult.rows=error.rows
              }
              loading.status=false
              // const { username, password } = ruleForm
              // if (username === 'admin' && password === '123456') {
              //   ctx.$message.success('登录成功了~');
              //   router.push('home')
              // } else {
              //   ctx.$message.error('账户或密码有误~');
              // }
            }
          });
        } catch (error){
          console.log(error);
        }
      }
      // 重置
        const resetForm = () => {
            PerfTestReqruleForm.value?.resetFields();
        }
      // 定义加载状态
    const loading = reactive({ 
      status: false 
    })
    // 定义表格数据
    const tableDataDetail = reactive({ 
      data: []
    })
    // 定义初始化结果
    const GetTestDetailResult: GetTestDetailModelRef = reactive<GetTestDetailModelRef>({
      code: -1,
      msg: '',
      testType:'',
      histories:[],
      resUsage:[],
      funcDetail:[]
    })
    //Start按钮显示表单
    const StartBenchmark=()=>{
      console.log(dialogFormVisible)
      dialogFormVisible.data=true
      console.log(dialogFormVisible)
    }
    const dialogFormVisible=reactive({ 
      data: false
    })
    //初始化获取详情按钮
    const  GetTestDetail = async () => {
      dialogFormVisible.data=false
      loading.status=true
      try {
        const response = await axios.get('/3tk/GetTestDetail.json');
        console.log(response);
        console.log("success:"+response);
        GetTestDetailResult.code=response.data.code
        GetTestDetailResult.msg=response.data.msg
        GetTestDetailResult.testType=response.data.testType
        GetTestDetailResult.resUsage=response.data.resUsage
        GetTestDetailResult.funcDetail=response.data.funcDetail
        tableDataDetail.data=response.data.perfDetail
        
      } catch (error) {
        console.log(error.message);
        console.log(error.code);
        GetTestDetailResult.code=error.code
        GetTestDetailResult.msg=error.message
      }
      
      loading.status=false
    }
    //饼图图标
    const bingtudata1 = [
      { type: 'succ', value: 90 },
      { type: 'fail', value: 10 }
    ];
    const bingtudata2 = [
      { type: "0~10ms", value: 135 },
      { type: "10~30ms", value: 10 },
      // { type: "30~50ms", value: 0 },
      // { type: "50~100ms", value: 0 },
      // { type: "100~500ms", value: 0 },
      // { type: "0.5~3s", value: 0} ,
      // { type: "3~5s", value: 0 },
      // { type: "5~100s", value: 0}
    ];
      return {
        startform,
        startformrules,
        submitForm,
        PerfTestReqruleForm,
        tableDataDetail,
        resetForm,
        GetTestDetail,
        dialogFormVisible,
        StartBenchmark,
        loading,
        bingtudata1,
        bingtudata2,
        GetTestDetailResult
      }
  },
  mounted () {
    // const data = [
    //   { type: 'succ', value: 90 },
    //   { type: 'fail', value: 10 }
    // ];
    /*
    const { ctx }: any = getCurrentInstance();
    const piePlot = new Pie('container', {
      appendPadding: 20,
      data:ctx.bingtudata1,
      angleField: 'value',
      colorField: 'type',
      radius: 0.75,
      label: {
        type: 'outer',
        labelHeight: 20,
        content: '{name}\n{percentage}',
      },
      interactions: [ { type: 'element-active' }],
    });

    piePlot.render();
    const piePlot1 = new Pie('container1', {
      appendPadding: 5,
      data:ctx.bingtudata2,
      angleField: 'value',
      colorField: 'type',
      radius: 0.75,
      label: {
        type: 'spider',
        labelHeight: 20,
        content: '{name}\n{percentage}',
      },
      interactions: [ { type: 'element-active' }],
    });

    piePlot1.render();*/
  },
  data(){
    return {
      radio:'1',
      formLabelWidth:'30%'
    }
  }
});
</script>
<style scoped>
  .el-table td,.el-table th {
    text-align: center !important;
  }
  .performance{
    text-align: center;
  }
  .el-dialog .el-dialog__header{
    text-align: left;
  }
  .el-input{
    width: 217px;
  }
  .el-dialog{
    width: 580px;
  }
  .el-table__header col[name="gutter"] {
    display: table-cell !important;
  }
</style>