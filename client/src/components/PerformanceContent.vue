<template>
  <div class="performance">
    <h1>Performance Test</h1>
    <el-button type="primary" @click="StartBenchmark" plain>StartBenchmark</el-button>
    <div v-loading="loading.status" height="200px">
      <!-- 无数据时 -->
      <el-empty description="No Data" v-if="GetTestDetailResult.code==-1"></el-empty>
      <!-- 有数据时 -->
      <!-- 自适应栅格 -->
      <el-row>
        <el-col :span="1"></el-col>
        <el-col :span="22">
          <div v-if="GetTestDetailResult.code!=-1">
            <el-row style="margin-top:20px">
              <el-radio-group v-model="radio">
                <el-radio label="1" border>Detailed indicators</el-radio>
                <el-radio label="2" border>Interval distribution</el-radio>
              </el-radio-group>
            </el-row>

            <el-table v-loading="loading.status" v-show="radio=== '1'" :data="tableDataDetail.data" border
                      style="width: 100%;margin-top:20px" :header-cell-style="{background:'#F9FAFC'}">
              <el-table-column prop="timeStr" label="timeStr" min-width="180"></el-table-column>
              <el-table-column prop="qps" label="qps"></el-table-column>
              <el-table-column prop="totalReq" label="totalReq"></el-table-column>
              <el-table-column prop="succ" label="succ"></el-table-column>
              <el-table-column prop="failed" label="failed"></el-table-column>
              <el-table-column prop="succRate" label="succRate"></el-table-column>
              <el-table-column prop="costMax" label="costMax"></el-table-column>
              <el-table-column prop="costMin" label="costMin"></el-table-column>
              <el-table-column prop="costAvg" label="costAvg"></el-table-column>
              <el-table-column prop="p90" label="p90"></el-table-column>
              <el-table-column prop="p99" label="p99"></el-table-column>
              <el-table-column prop="p999" label="p999"></el-table-column>
              <el-table-column prop="sendByte" label="sendByte"></el-table-column>
              <el-table-column prop="recvByte" label="recvByte"></el-table-column>
            </el-table>

            <el-row v-show="radio=== '2'">
              <div class="return_chart">
                <ve-pie :legend="returnChartOptions.legend" :title="returnChartOptions.title" :data="returnChartOptions"
                        width="500px"></ve-pie>
                <ve-pie :legend="costChartOptions.legend" :title="costChartOptions.title" :data="costChartOptions"
                        width="500px"></ve-pie>
              </div>
              <div id="container"></div>
              <div id="container1"></div>
            </el-row>
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
    <el-dialog title="Configure" v-model="dialogFormVisible.data" center top="8vh" width="580px">
      <el-form :model="startform" ref="PerfTestReqruleForm" :rules="startformrules" label-position="right"
               label-width="360px">
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
        <el-form-item label="threads" :label-width="formLabelWidth" prop="threads">
          <el-input v-model="startform.threads" autocomplete="off"></el-input>
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
        <el-form-item label="pkgLen" :label-width="formLabelWidth" prop="pkgLen">
          <el-select v-model="startform.pkgLen" placeholder="Please select pkgLen">
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
    </el-dialog>
  </div>
</template>
<script lang="ts">
import axios from 'axios';
import {getCurrentInstance, reactive, ref} from "vue";

interface PerfTestReqForm {
  lang: string,
  servType: string,
  threads?: number,
  cores?: number,
  connCnt?: number,
  reqFreq?: number,
  keepAlive?: number,
  pkgLen?: number
}

interface PerfTestModelRef {
  code: number,
  msg: string,
  testID: number
}

//初始化框架接口
interface GetTestDetailModelRef {
  code: number,
  msg: string,
  perfDetail: any,
  resUsage: any,
}

export default ({
  setup() {
    const {ctx}: any = getCurrentInstance();
    const PerfTestReqruleForm = ref<any>(null);
    const PerfTestResult: PerfTestModelRef = reactive<PerfTestModelRef>({
      code: -1,
      msg: '',
      testID: 0,
    });
    const mappedCost: any = {}, mappedRet: any = {};
    // 定义变量
    const startform: PerfTestReqForm = reactive<PerfTestReqForm>({
      lang: 'golang',
      servType: 'testperf',
      pkgLen: 0,
      threads: 1,
      cores: 1,
      connCnt: 1,
      reqFreq: 1,
      keepAlive: 10
      // pkgLen: ''
    });
    //正整数验证
    const integer = async (rule: any, value: string, callback: any): Promise<void> => {
      const boolean = new RegExp('^[1-9][0-9]*$').test(value);
      //console.log(boolean)
      if (!boolean) {
        callback(new Error('Please enter a positive integer'));
      } else {
        callback();
      }
    };
    //正整数与0验证
    const integer0 = async (rule: any, value: string, callback: any): Promise<void> => {
      const boolean = new RegExp('^[1-9][0-9]*$').test(value);
      const iszero = Number(value) === 0 ? true : false;
      if (boolean || iszero) {
        callback();
      } else {
        callback(new Error('Please enter a positive integer or zero'));
      }
    };
    // 定义验证规则
    const startformrules = {
      servName: [
        {required: true, message: 'Please select a service name', trigger: 'change'},
        {type: 'string', "min": 1, message: 'The content type is string', trigger: 'blur'}
      ],
      servType: [
        {required: true, message: 'Please fill in the server type: hardware description', trigger: 'blur'},
        {type: 'string', "min": 1, message: 'The content type is string', trigger: 'blur'}
      ],
      threads: [
        {required: true, message: 'Please fill in the number of server threads', trigger: 'blur'},
        {type: 'number', trigger: 'blur', validator: integer}
      ],
      cores: [
        {required: true, message: 'Please fill in the server audit', trigger: 'blur'},
        {type: 'number', trigger: 'blur', validator: integer}
      ],
      connCnt: [
        {required: true, message: 'Please fill in the number of node connections', trigger: 'blur'},
        {type: 'number', trigger: 'blur', validator: integer}
      ],
      reqFreq: [
        {required: true, message: 'Please fill in the connection request rate', trigger: 'blur'},
        {type: 'number', trigger: 'blur', validator: integer}
      ],
      keepAlive: [
        {required: true, message: 'Please fill in the number of seconds for pressure measurement', trigger: 'blur'},
        {type: 'number', trigger: 'blur', validator: integer}
      ],
      pkgLen: [
        {required: true, message: 'Please select the package size', trigger: 'change'},
        {type: 'number', trigger: 'change', validator: integer0}
      ]
    };

    // 确认
    const submitForm = () => {
      (PerfTestReqruleForm.value as any).validate(async (valid: boolean) => {
        if (valid) {
          console.log(startform);
          loading.status = true;
          try {
            const response = await axios.post('/api/testPerf', {
              lang: startform.lang,
              servType: startform.servType,
              threads: startform.threads,
              cores: startform.cores,
              connCnt: startform.connCnt,
              reqFreq: startform.reqFreq,
              keepAlive: startform.keepAlive,
              pkgLen: startform.pkgLen
            });
            console.log(response);
            PerfTestResult.code = response.data.code;
            PerfTestResult.msg = response.data.msg;
            PerfTestResult.testID = response.data.testID;
          } catch (error) {
            console.log(error);
            PerfTestResult.code = error.code;
            PerfTestResult.msg = error.message;
            PerfTestResult.testID = 0;
          }
          loading.status = false;
        }
      });
    };
    // 重置
    const resetForm = () => {
      PerfTestReqruleForm.value?.resetFields();
    };
    // 定义加载状态
    const loading = reactive({
      status: false
    });
    // 定义表格数据
    const tableDataDetail = reactive({
      data: []
    });
    // 定义初始化结果
    const GetTestDetailResult: GetTestDetailModelRef = reactive<GetTestDetailModelRef>({
      code: -1,
      msg: '',
      perfDetail: [],
      resUsage: [],
    });
    //Start按钮显示表单
    const StartBenchmark = () => {
      //console.log(dialogFormVisible)
      dialogFormVisible.data = true;
      console.log(dialogFormVisible);
    };
    const dialogFormVisible = reactive({
      data: false
    });

    //resultMap
    const RET_MAP: any = {
      "0": "SUCCESS",
      "-1": "EXCEPTION",
      "-101": "INIT_PARAM_ERROR",
      "-102": "URL_ERROR",
      "-1001": "PACKET_ENCODE_ERROR",
      "-1002": "PACKET_DECODE_ERROR",
      "-1003": "PACKET_PARAM_ERROR",
      "-2000": "SOCK_ERROR",
      "-2001": "SOCK_INVALID",
      "-2003": "SOCK_CONN_ERROR",
      "-2004": "SOCK_CONN_TIMEOUT",
      "-2005": "SOCK_SEND_ERROR",
      "-2006": "SOCK_RECV_ERROR",
      "-2007": "SOCK_RECV_TIMEOUT"
    };

    const COST_MAP: any = {
      "0": "0~10ms",
      "1": "10~30ms",
      "2": "30~50ms",
      "3": "50~100ms",
      "4": "100~500ms",
      "5": "0.5~3s",
      "6": "3~5s",
      "7": "5~100s"
    };
    //初始化获取详情按钮
    const GetTestDetail = async () => {
      dialogFormVisible.data = false;
      loading.status = true;
      try {
        const response = await axios.get('/3tk/GetTestDetail.json');
        console.log(response);
        GetTestDetailResult.code = response.data.code;
        GetTestDetailResult.msg = response.data.msg;
        GetTestDetailResult.resUsage = response.data.resUsage;
        GetTestDetailResult.perfDetail = response.data.perfDetail;
        GetTestDetailResult.perfDetail.map((item: any) => {
          for (let key in item.cost_map) {
            if (COST_MAP[key]) mappedCost[COST_MAP[key]] += item.cost_map[key];
          }
          for (let key in item.ret_map) {
            mappedRet[RET_MAP[key] || key] += item.ret_map[key];
          }
          item.cost_map = mappedCost;
          item.ret_map = mappedRet;
          return item;
        });
        tableDataDetail.data = response.data.perfDetail;
      } catch (error) {
        console.log(error.message);
        console.log(error.code);
        GetTestDetailResult.code = error.code;
        GetTestDetailResult.msg = error.message;
      }

      loading.status = false;
    };

    const costChartOptions = async () => {
      return pieFromResult("Cost Stat", "返回值", "数量", "cost_map");
    };
    const returnChartOptions = async () => {
      return pieFromResult("Ret Stat", "返回值", "数量", "ret_map");
    };
    const pieFromResult = async (title: string, field1: string, field2: string, mapFieldName: string) => {
      let rowsMap: any = {};
      for (let result of GetTestDetailResult.perfDetail) {
        if (!result[mapFieldName]) continue;
        for (let key in result[mapFieldName]) {
          if (!rowsMap[key]) rowsMap[key] = 0;
          rowsMap[key] += result[mapFieldName][key];
        }
      }
      let rows = Object.keys(rowsMap).map((key) => {
        return {
          [field1]: key,
          [field2]: rowsMap[key]
        };
      });
      return {
        title: {
          text: title || ""
        },
        legend: {
          orient: 'vertical',
          top: 50,
          right: 0
        },
        columns: [field1, field2],
        rows
      };
    };

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
      GetTestDetailResult,
      costChartOptions,
      returnChartOptions
    };
  },
  data() {
    return {
      radio: '1',
      formLabelWidth: '30%'
    };
  },
});
</script>
<style scoped>
.el-table td, .el-table th {
  text-align: center !important;
}

.performance {
  text-align: center;
}

.el-dialog .el-dialog__header {
  text-align: left;
}

.el-input {
  width: 217px;
}

.el-dialog {
  width: 580px;
}

.el-table__header col[name="gutter"] {
  display: table-cell !important;
}
</style>