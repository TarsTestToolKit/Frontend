<template>
  <div class="report">
    <h1 style="text-align: center;">TarsTestToolKit</h1>
    <el-row style="padding-top:20px;">
      <el-col :span="5">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="StartBenchmark" plain>性能测试</el-button>
      </el-col>
      <el-col :span="5">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="doFuncTest" plain>功能测试</el-button>
      </el-col>
      <el-col :span="5"></el-col>
      <el-col :span="5"></el-col>
      
      <el-col :span="2">
        <!-- <el-button type="primary" icon="el-icon-refresh" @click="GetTestHistories(paginationData.currentpage,paginationData.currentpagesize)" plain>GetReport</el-button> -->
      </el-col>
    </el-row>
    
    
  </div>
  <el-dialog title="测试结果" v-model="FunctionaldialogTableVisible.data" width="30%">
    <el-table v-if="DoFuncTestresult.code!=-1" :data="DoFuncTestresult.rows" border :header-cell-style="{background:'#F9FAFC'}">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="from" label="发起方"></el-table-column>
      <el-table-column property="to" label="接收方"></el-table-column>
      <el-table-column property="isSucc" label="结果">
        <template #default="scope">
          <el-tag
            :type="scope.row.isSucc === true ? 'success' : 'danger'"
            disable-transitions>{{scope.row.isSucc === true ? 'Succeed' : 'Fail'}}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
  <div v-loading="loading.status">
      <!-- 无数据时 -->
      <!-- <el-empty description="No Data" v-if="GetTestHistoriesResult.total===0"></el-empty> -->
      <!-- 有数据时 -->
      <!-- 自适应栅格 -->
      <el-row style="padding-top:20px;">
        <el-col :span="1"></el-col>
        <el-col :span="22">
          
          <!-- <div v-if="GetTestHistoriesResult.total>0"> -->
            <el-table :default-sort="{prop: 'testID', order: 'ascending'}" :data="tableData.data" border stripe style="width: 100%;" :header-cell-style="{background:'#F9FAFC'}" >
              <el-table-column prop="testID" label="测试ID"> </el-table-column>
              <el-table-column prop="startTime" label="开始时间" :formatter="formatdate"> </el-table-column>
              <el-table-column prop="endTime" label="结束时间" :formatter="formatdate"> </el-table-column>
              <el-table-column prop="lang" label="被测服务语言"> </el-table-column>
              <el-table-column prop="servType" label="硬件描述信息"> </el-table-column>
              <el-table-column prop="threads" label="服务端线程数"> </el-table-column>
              <!-- <el-table-column prop="cores" label="服务端核数"> </el-table-column> -->
              <el-table-column prop="connCnt" label="节点连接数"> </el-table-column>
              <el-table-column prop="reqFreq" label="请求速率(个/秒)"> </el-table-column>
              <el-table-column prop="keepAlive" label="压测时长(s)"> </el-table-column>
              <el-table-column prop="pkgLen" label="压测包大小" :formatter="formatpkgLen"> </el-table-column>
              <el-table-column prop="finished" label="状态">
                <template #default="scope">
                    <el-tag
                      :type="scope.row.finished === 0 ? 'danger' : 'success'"
                      disable-transitions>{{scope.row.finished===0?'running':'finished'}}
                    </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right">
                <template #default="scope">
                  <el-button @click="handleClick(scope.$index, scope.row)" type="text" size="small">
                    详情
                  </el-button>
                </template>
              </el-table-column>
              
            </el-table>
            <div style="text-align:center;margin-top:30px;">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="paginationData.currentpage"
                :page-sizes="[10, 20, 30 , 40 , 50]"
                :page-size="paginationData.currentpagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="GetTestHistoriesResult.total">
              </el-pagination>
            </div>
          <!-- </div> -->
        </el-col>
        <el-col :span="1"></el-col>
      </el-row>
  </div>
  <!-- 开始测试表单 -->
  <el-dialog title="压测参数配置" v-model="doPerfTestdialogFormVisible.data" center top="8vh" width="640px">
    <el-form :model="startform" ref="PerfTestReqruleForm" :rules="startformrules" label-position="right">
      <el-form-item label="被测服务语言" :label-width="formLabelWidth" prop="lang">
        <el-select v-model="startform.lang" placeholder="Please select lang">
          <el-option label="golang" value="golang"></el-option>
          <el-option label="java" value="java"></el-option>
          <el-option label="cpp" value="cpp"></el-option>
          <el-option label="nodejs" value="nodejs"></el-option>
          <el-option label="php" value="php"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="被测服务器硬件描述信息" :label-width="formLabelWidth" prop="servType" label-width="200px">
        <el-input v-model="startform.servType" autocomplete="off" placeholder="eg.16C8G"></el-input>
      </el-form-item>
      <el-form-item label="服务端线程数" :label-width="formLabelWidth" prop="threads">
        <el-input v-model="startform.threads" autocomplete="off"></el-input>
      </el-form-item>
      <!-- <el-form-item label="服务器核数" :label-width="formLabelWidth" prop="cores">
        <el-input v-model="startform.cores" autocomplete="off"></el-input>
      </el-form-item> -->
      <el-form-item label="节点连接数" :label-width="formLabelWidth" prop="connCnt">
        <el-input v-model="startform.connCnt" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="请求速率(个/秒)" :label-width="formLabelWidth" prop="reqFreq">
        <el-input v-model="startform.reqFreq" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="压测时长(s)" :label-width="formLabelWidth" prop="keepAlive">
        <el-input v-model="startform.keepAlive" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="压测包大小" :label-width="formLabelWidth" prop="pkgLen">
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
        <el-button @click="doPerfTestdialogFormVisible.data = false">取消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </span>
    </template>
  </el-dialog> 
  <el-drawer
    v-model="tabledetail.status"
    direction="btt"
    :append-to-body="true"
    :title="title.data"
    :before-close="handleClose"
    size="100%">
    <template #title>
      <el-row>
        <el-col :span="2">
          {{title.data}}
        </el-col>
        <el-col :span="2">
          <el-button :type="title.type" :loading="title.loading" size="mini">{{title.text}}</el-button>
        </el-col>
        <el-col :span="6">
          <el-progress :text-inside="true" :stroke-width="28" :percentage="title.percentage" :status="title.percentagestatus" :format="percentageformat"></el-progress>
        </el-col>
        <el-col :span="12"></el-col>
      </el-row>
    </template>
    <el-tabs type="border-card">
      <el-tab-pane label="详细指标" class="pane1">
        <el-scrollbar class="tabcontent">
        <el-row style="padding-top:20px;">
          <el-col :span="2"></el-col>
          <el-col :span="4">
              被测服务语言
              <div class="pdt10">
                <el-input
                  v-model="clickrow.lang"
                  :disabled="true">
                </el-input>
              </div>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="4">
              被测服务器硬件描述信息
              <div class="pdt10">
                <el-input
                  v-model="clickrow.servType"
                  :disabled="true">
                </el-input>
              </div>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="4">
              服务端线程数
              <div class="pdt10">
                <el-input
                  v-model="clickrow.threads"
                  :disabled="true">
                </el-input>
              </div>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="4">
              <!-- 服务器核数
              <div class="pdt10">
                <el-input
                  v-model="clickrow.cores"
                  :disabled="true">
                </el-input>
              </div> -->
              节点连接数
              <div class="pdt10">
                <el-input
                  v-model="clickrow.connCnt"
                  :disabled="true">
                </el-input>
              </div>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="2"></el-col>
        </el-row>
        <el-row style="padding-top:20px;padding-bottom:20px;">
          <el-col :span="2"></el-col>
          <el-col :span="4">
              请求速率(个/秒)
              <div class="pdt10">
                <el-input
                  v-model="clickrow.reqFreq"
                  :disabled="true">
                </el-input>
              </div>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="4">
              压测时长(s)
              <div class="pdt10">
                <el-input
                  v-model="clickrow.keepAlive"
                  :disabled="true">
                </el-input>
              </div>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="4">
              压测包大小
              <div class="pdt10">
                <el-input
                  v-model="clickrow.pkgLen"
                  :disabled="true">
                </el-input>
              </div>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="4">
              
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="2"></el-col>
        </el-row>
        <el-table :data="tabledetailData.perfDetail" border :header-cell-style="{background:'#F9FAFC'}" :default-sort="{prop: 'timestamp', order: 'ascending'}">
            <el-table-column property="timestamp" label="时间" :formatter="formatdate" sortable :sort-orders="['ascending', 'descending']"></el-table-column>
            <el-table-column property="totalReq" label="总请求量"></el-table-column>
            <el-table-column property="succ" label="成功数"></el-table-column>
            <el-table-column property="succRate" label="成功率"></el-table-column>
            <el-table-column property="failed" label="失败数"></el-table-column>
            <el-table-column property="qps" label="QPS"></el-table-column>
            <el-table-column property="costMin" label="最小耗时(ms)"></el-table-column>
            <el-table-column property="costMax" label="最大耗时(ms)"></el-table-column>
            <el-table-column property="costAvg" label="平均耗时(ms)" :formatter="format2dot"></el-table-column>
            <el-table-column property="p90" label="P90" :formatter="format2dot"></el-table-column>
            <el-table-column property="p99" label="P99" :formatter="format2dot"></el-table-column>
            <el-table-column property="p999" label="P999" :formatter="format2dot"></el-table-column>
            <el-table-column property="sendByte" label="发送包"></el-table-column>
            <el-table-column property="recvByte" label="接收包"></el-table-column>
        </el-table>
        <el-row style="height:100px;">&nbsp;</el-row>
        </el-scrollbar>
      </el-tab-pane>
      
      <el-tab-pane label="区间分布" class="pane2">
        <el-scrollbar class="tabcontent">
        <el-row>
          <el-col :span="12">
              <h4>返回值分布</h4>
              <div id="container_return_value" style="width:100%"></div>
          </el-col>  
          <el-col :span="12">
              <h4>耗时区间分布</h4>
              <div id="container_time_interval" style="width:100%"></div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
              <h4>内存</h4>
              <div id="container_mem"></div>
          </el-col>
        </el-row>
        <el-row>
              <el-col v-for="(item,index) in cpu_data.data" :key="index" :span="12">
                <h4>CPU-{{index+1}}</h4>
                <div :id="`chart${index}`" style="width:100%">
                </div>
              </el-col>
        </el-row>
        <el-row style="height:100px;">&nbsp;</el-row>
        </el-scrollbar>
      </el-tab-pane>
      
    </el-tabs>
    <el-backtop target=".pane1 .tabcontent .el-scrollbar__wrap"></el-backtop>
    <el-backtop target=".pane2 .tabcontent .el-scrollbar__wrap"></el-backtop>
  </el-drawer>
</template>
<script lang="ts">
//引入axios
import axios from 'axios'
import moment from 'moment'
import {  getCurrentInstance,reactive,Ref,ref} from "vue";
import { ElNotification,ElLoading  } from 'element-plus';
import { Area,Line,Pie } from '@antv/g2plot';
//函数测试接口定义
interface DoFuncTestModelRef {
  code: number,
  msg: string,
  rows:any
}
//新建压测数据接口定义
interface PerfTestReqModelRef {
  lang: string,
  servType: string,
  threads?: number,
  //cores?: number,
  connCnt?: number,
  reqFreq?: number,
  keepAlive?: number,
  pkgLen?: number
}
//历史记录
interface GetTestHistoriesModelRef {
  code: number,
  msg: string,
  total:number,
  page:number,
  histories:any
}
//历史记录详情
interface GetTestHistoriesdetailModelRef {
  code: number,
  msg: string,
  perfDetail:any,
  resUsage:any
}
export default({
  setup() {
    // 定义函数测试结果
    const DoFuncTestresult: DoFuncTestModelRef = reactive<DoFuncTestModelRef>({
      code: -1,
      msg: '',
      rows: ''
    })
    //PerfTestReqruleForm
    const PerfTestReqruleForm = ref<any>(null);
    // 定义变量
    const startform: PerfTestReqModelRef = reactive<PerfTestReqModelRef>({
      lang: 'cpp',
      servType: '',
      pkgLen:0,
      threads: 10,
      //cores: 10,
      connCnt: 10,
      reqFreq: 10,
      keepAlive: 60
    })
    //正整数验证
    const integer= async(rule: any, value: string, callback: any): Promise<void> => {
      const boolean = new RegExp('^[1-9][0-9]*$').test(value)
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
      servType: [
        { required: true, message: '请填写被测服务器硬件描述信息', trigger: 'blur' },
        { type: 'string',"min": 1, message: 'The content type is string', trigger: 'blur' }
      ],
      threads: [
        { required: true, message: '请填写服务端线程数', trigger: 'blur' },
        { type: 'number', trigger: 'blur',validator: integer }
      ],
      // cores: [
      //   { required: true, message: '请填写服务器核数', trigger: 'blur'},
      //   { type: 'number', trigger: 'blur',validator: integer }
      // ],
      connCnt: [
        { required: true, message: '请填写节点连接数', trigger: 'blur'},
        { type: 'number', trigger: 'blur',validator: integer }
      ],
      reqFreq: [
        { required: true, message: '请填写请求速率(个/秒)', trigger: 'blur'},
        { type: 'number', trigger: 'blur',validator: integer }
      ],
      keepAlive: [
        { required: true, message: '请填写压测执行多少秒', trigger: 'blur'},
        { type: 'number', trigger: 'blur',validator: integer }
      ],
      pkgLen: [
        { required: true, message: '请选择压测包大小', trigger: 'change' },
        { type: 'number', trigger: 'change',validator: integer0 }
      ]
    }
    //函数测试结果窗口
    const FunctionaldialogTableVisible=reactive({ 
      data: false
    })
    //压测提交窗口是否可见
    const doPerfTestdialogFormVisible=reactive({ 
      data: false
    })
    //详情页面drawer左上角标题及指定testID运行状态
    const title = reactive({ 
      data: "",
      type:"primary",
      text:"loading",
      loading:true,
      percentage:0,
      percentagestatus:"exception",
      remaintime:0,
      maxtimestamp:0
    })
    //详情按钮获取行数据
    const clickrow = reactive({ 
      testID: "",
      lang:"",
      servType: "",
      threads: "",
      //cores: "",
      connCnt: "",
      reqFreq: "",
      keepAlive: "",
      pkgLen: "",
      startTime:0,
      endTime:0
    })
    // 获取当前实例
    const { ctx }: any = getCurrentInstance();
    // 历史记录按钮加载状态
    const loading = reactive({ 
      status: false 
    })
    // 详情按钮加载状态
    const tabledetail = reactive({ 
      status: false ,
      intervalId:-1
    })
    // 历史记录
    const tableData:any = reactive({ 
      data: []
    })
    // 详情按钮数据
    const tabledetailData:any = reactive({ 
      perfDetail: [],
      resUsage:[],
      cpu:[],
      mem:[]
    })
    //分页组件数据
    const paginationData = reactive({ 
      currentpagesize: 10,
      currentpage:0
    })
    
    // 历史记录
    const GetTestHistoriesResult: GetTestHistoriesModelRef = reactive<GetTestHistoriesModelRef>({
      code: -1,
      msg: '',
      total:0,
      page:0,
      histories: ''
    })
    // 详情
    const GetTestHistoriesdetailResult: GetTestHistoriesdetailModelRef = reactive<GetTestHistoriesdetailModelRef>({
      code: -1,
      msg: '',
      perfDetail:'',
      resUsage:''
    })
    
    //存储图表实例
    const array_biao = reactive({ 
      data: [] 
    })
    //定义CPU数据变量
    const cpu_data:any = reactive({ 
      data: [] 
    })
    //methods
    //历史记录按钮
    const  GetTestHistories = async (currentpage:number,currentpagesize:number) => {
      DoFuncTestresult.code=-1
      loading.status=true
      try {
        const response = await axios.get('/api/histories', {
          params: {
            page: currentpage,
            pageSize:currentpagesize
          }});
        if(response.data.code===-1){
          ElNotification({
            title: 'error',
            message: response.data.msg,
            type: 'error'
          });
        }else{
          GetTestHistoriesResult.code=response.data.code
          GetTestHistoriesResult.msg=response.data.msg
          GetTestHistoriesResult.page=response.data.page
          GetTestHistoriesResult.total=response.data.total
          GetTestHistoriesResult.histories=response.data.histories
          tableData.data=response.data.histories
        }
      } catch (error) {
        ElNotification({
          title: 'error',
          message: error.message,
          type: 'error'
        });
        GetTestHistoriesResult.code=error.code
        GetTestHistoriesResult.msg=error.message
        GetTestHistoriesResult.histories=error.histories
      }
      loading.status=false
    }
    //函数测试按钮
    const  doFuncTest = async () => {
      FunctionaldialogTableVisible.data=true
      //GetTestHistoriesResult.code=-1
      loading.status=true
      try {
        const response = await axios.post('/api/testFunc');
        DoFuncTestresult.code=response.data.code
        DoFuncTestresult.msg=response.data.msg
        DoFuncTestresult.rows=response.data.rows
      } catch (error) {
        ElNotification({
          title: 'error',
          message: error.message,
          type: 'error'
        });
        DoFuncTestresult.code=error.code
        DoFuncTestresult.msg=error.message
        DoFuncTestresult.rows=error.rows
      }
      loading.status=false
    }
    //压测按钮
    const StartBenchmark=()=>{
      doPerfTestdialogFormVisible.data=true
    }
    //开始压测确认按钮
    const submitForm = () => {
      try {
        (PerfTestReqruleForm.value as any).validate( async (valid: boolean) => {
          if (valid) {
            doPerfTestdialogFormVisible.data=false
            loading.status=true
            let loadingall = ElLoading.service({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            try {
              const response = await axios.post('/api/testPerf',{
                lang: startform.lang,
                servType: startform.servType,
                threads:startform.threads,
                //cores: startform.cores,
                connCnt: startform.connCnt,
                reqFreq: startform.reqFreq,
                keepAlive: startform.keepAlive,
                pkgLen:startform.pkgLen
              });
              if(response.data.code!==0){
                ElNotification({
                  title: 'error',
                  message: response.data.message,
                  type: 'error'
                });
              }else{
                let reqtest={
                  lang: startform.lang,
                  servType: startform.servType,
                  threads:startform.threads,
                  //cores: startform.cores,
                  connCnt: startform.connCnt,
                  reqFreq: startform.reqFreq,
                  keepAlive: startform.keepAlive,
                  pkgLen:startform.pkgLen,
                  testID:response.data.testID,
                  startTime:moment().unix(),
                  endTime:moment().add(Number(startform.keepAlive),'second').unix()
                }
                handleClick(0, reqtest)
                setTimeout(() => {
                  ElNotification({
                    title: 'success',
                    message: "测试ID:"+response.data.testID,
                    type: 'success'
                  });
                }, 500);
                
              }
            } catch (error) {
              ElNotification({
                title: 'error',
                message: error.message,
                type: 'error'
              });
            }
            loading.status=false
            loadingall.close();
            GetTestHistories(paginationData.currentpage,paginationData.currentpagesize)
          }
        });
      } catch (error){
        ElNotification({
          title: 'error',
          message: error.message,
          type: 'error'
        });
      }
    }
    //重置按钮
    const resetForm = () => {
        PerfTestReqruleForm.value?.resetFields();
    }
    //详情按钮
    const handleClick=async(index: any, row: any) =>{
        tabledetail.status=true
        title.data="测试ID:"+row.testID;
        clickrow.testID=row.testID
        clickrow.lang=row.lang
        clickrow.servType=row.servType
        clickrow.threads=row.threads
        //clickrow.cores=row.cores
        clickrow.connCnt=row.connCnt
        clickrow.reqFreq=row.reqFreq
        clickrow.keepAlive=row.keepAlive
        //clickrow.pkgLen=row.pkgLen
        if(row.pkgLen===0){
          clickrow.pkgLen="0K"
        }
        if(row.pkgLen===1*1024){
          clickrow.pkgLen="1K"
        }
        if(row.pkgLen===10*1024){
          clickrow.pkgLen="10K"
        }
        if(row.pkgLen===100*1024){
          clickrow.pkgLen="100K"
        }
        if(row.pkgLen===1024*1024){
          clickrow.pkgLen="1M"
        }
        if(row.pkgLen===5*1024*1024){
          clickrow.pkgLen="5M"
        }
        clickrow.startTime=row.startTime
        clickrow.endTime=row.endTime
        loading.status=true
        try {
          const response = await axios.get('/api/detail',{
            params: {
              testID: row.testID
            }
          });
          
          if(response.data.code===1&&response.data.msg==="succ"){
            title.type="danger"
            title.loading=true
            title.text="running"
          }else if(response.data.code===0){
            title.type="success"
            title.loading=false
            title.text="finished"
            title.percentage=100
            title.percentagestatus="success"
            title.maxtimestamp=0
            //清除定时器，并初始化
            if(tabledetail.intervalId!==-1){
              clearInterval(tabledetail.intervalId);
              tabledetail.intervalId=-1
            }
            
          }else if(response.data.code===-1||(response.data.code===1&&response.data.message!=="")){
            ElNotification({
              title: 'error',
              message: response.data.msg||response.data.message,
              type: 'error'
            });
            tabledetail.status=false
          }
          GetTestHistoriesdetailResult.code=response.data.code
          GetTestHistoriesdetailResult.msg=response.data.msg
          GetTestHistoriesdetailResult.perfDetail=response.data.perfDetail
          GetTestHistoriesdetailResult.resUsage=response.data.resUsage
          tabledetailData.perfDetail=response.data.perfDetail
          tabledetailData.resUsage=response.data.resUsage
          tabledetailData.cpu=response.data.resUsage.cpu
          tabledetailData.mem=response.data.resUsage.mem
          let datatem = response.data.resUsage
          //定义内存局部变量mem_data
          let mem_data: { type: string;sort: any; timestamp: any; value: any; }[]=new Array()
          //加工处理后台接口返回内存数据
          datatem.every((val: any, idx: any, array: any) => {
              // val: 当前值
              // idx：当前index
              // array: Array
              // 内存数据转换单位为GB
              let total_num: number = val.mem.total/1024/1024/1024; 
              let total_str: string = total_num.toFixed(2);
              let used_num: number = val.mem.used/1024/1024/1024; 
              let used_str: string = used_num.toFixed(2);
              mem_data.push(
                {
                  "type": "total ( GB )",
                  "sort":val.timestamp,
                  "timestamp": formatprosdate(val.timestamp),
                  "value": parseFloat(total_str)
                }
              )
              mem_data.push(
                {
                  "type": "used ( GB )",
                  "sort":val.timestamp,
                  "timestamp": formatprosdate(val.timestamp),
                  "value": parseFloat(used_str)
                }
              )
              return true; // Continues
          });
          //渲染内存多折线图
          rendermem(mem_data,array_biao)
          //渲染pie饼图
          renderpie(tabledetailData.perfDetail,array_biao)
          //加工处理后台接口返回CPU数据
          if(datatem[0].cpu.length>0){
            let cpu_data1=new Array()
            for(let i=0;i<=datatem[0].cpu.length-1;i++){
              let cpu_data_temp=new Array()
              datatem.every((val: any, idx: any, array: any) => {
                  cpu_data_temp.push(
                    {
                      "type":"free",
                      "sort":val.timestamp,
                      "timestamp": formatprosdate(val.timestamp),
                      "value": (1-val.cpu[i].percent)*100
                    }
                  )
                  cpu_data_temp.push(
                    {
                      "type":"used",
                      "sort":val.timestamp,
                      "timestamp": formatprosdate(val.timestamp),
                      "value": (val.cpu[i].percent)*100
                    }
                  )
                  
                  if(idx+1==datatem.length){
                    cpu_data1.push(cpu_data_temp.sort((a, b) =>{
                      return a.sort - b.sort
                    } ))
                  }
                  return true; // Continues
              });
            }
            cpu_data.data=cpu_data1
            //1秒后渲染CPU百分比面积图
            setTimeout(() => {
              rendercpu(cpu_data1,array_biao)
            }, 1000);
          }
          //如果在running中
          if(response.data.code===1&&response.data.msg==="succ"){
            //创建定时器，每5000ms获取一次数据
            tabledetail.intervalId=window.setInterval(async() => {
              //获取指定testID的详情接口
              const response_new = await axios.get('/api/detail',{
                params: {
                  testID: row.testID,
                  timestamp:title.maxtimestamp
                }
              });
              //返回code为0，结束定时器
              if(response_new.data.code===0&&response_new.data.msg==="succ"){
                  //详情页标题，状态按钮type
                  title.type="success"
                  //详情页标题，状态按钮loading
                  title.loading=false
                  //详情页标题，状态按钮text
                  title.text="finished"
                  title.percentage=100
                  title.percentagestatus="success"
                  title.maxtimestamp=0
                  //清空定时器
                  if(tabledetail.intervalId!==-1){
                    clearInterval(tabledetail.intervalId);
                    tabledetail.intervalId=-1
                  }
                  return true
              }
              let timestamparray:Array<number>=[]
              response_new.data.perfDetail.every((val: any, idx: any, array: any) => {
                    timestamparray.push(val.timestamp)
                    return true; // Continues
              });
              //maxtimestamp
              title.maxtimestamp=Math.max(...timestamparray)
              //运行时间百分百
              title.percentage=(Math.max(...timestamparray)-Number(clickrow.startTime))/Number(clickrow.keepAlive)*100
              //进度条颜色
              title.percentagestatus="exception"
              //剩余时间
              title.remaintime=Number(clickrow.endTime)-Math.max(...timestamparray)
              //增量更新性能数据
              if(tabledetailData.perfDetail.length===0){
                tabledetailData.perfDetail=response_new.data.perfDetail
              }else{
                response_new.data.perfDetail.every((val: any, idx: any, array: any) => {
                  tabledetailData.perfDetail.push(val)
                  return true; // Continues
                });
              }
              
              //增量更新性CPU、内存数据
              if(tabledetailData.resUsage.length===0){
                tabledetailData.resUsage=response_new.data.resUsage
              }else{
                response_new.data.resUsage.every((val: any, idx: any, array: any) => {
                    tabledetailData.resUsage.push(val)
                    return true; // Continues
                });
              }
              //更新图数据
              //定义内存局部变量mem_data_new
              let mem_data_new: { type: string;sort: any; timestamp: any; value: any; }[]=new Array()
              let datatem_new = response_new.data.resUsage
               //加工处理后台接口返回内存数据
              datatem_new.every((val: any, idx: any, array: any) => {
                  // 内存数据转换单位为GB
                  let total_num: number = val.mem.total/1024/1024/1024; 
                  let total_str: string = total_num.toFixed(2);
                  let used_num: number = val.mem.used/1024/1024/1024; 
                  let used_str: string = used_num.toFixed(2);
                  mem_data_new.push(
                    {
                      "type": "total ( GB )",
                      "sort":val.timestamp,
                      "timestamp": formatprosdate(val.timestamp),
                      "value": parseFloat(total_str)
                    }
                  )
                  mem_data_new.push(
                    {
                      "type": "used ( GB )",
                      "sort":val.timestamp,
                      "timestamp": formatprosdate(val.timestamp),
                      "value": parseFloat(used_str)
                    }
                  )
                  return true; // Continues
              });
              //更新内存多折线图
              rendermem_update(mem_data_new,array_biao)
              //更新饼图数据
              renderpie_update(tabledetailData.perfDetail,array_biao)
              //更新CPU数据
              if(datatem_new[0].cpu.length>0){
                let cpu_data1_new=new Array()
                for(let i=0;i<=datatem_new[0].cpu.length-1;i++){
                  let cpu_data_temp=new Array()
                  datatem_new.every((val: any, idx: any, array: any) => {
                      cpu_data_temp.push(
                        {
                          "type":"free",
                          "sort":val.timestamp,
                          "timestamp": formatprosdate(val.timestamp),
                          "value": (1-val.cpu[i].percent)*100
                        }
                      )
                      cpu_data_temp.push(
                        {
                          "type":"used",
                          "sort":val.timestamp,
                          "timestamp": formatprosdate(val.timestamp),
                          "value": (val.cpu[i].percent)*100
                        }
                      )
                      
                      if(idx+1==datatem_new.length){
                        cpu_data1_new.push(cpu_data_temp.sort((a, b) =>{
                          return a.sort - b.sort
                        } ))
                      }
                      return true; // Continues
                  });
                }
                cpu_data.data=cpu_data1_new
                //更新CPU百分比面积图
                setTimeout(() => {
                  rendercpu_update(cpu_data1_new,array_biao)
                }, 1000);
              }
              
            }, 5000);
          }
          
        } catch (error) {
          ElNotification({
            title: 'error',
            message: error.message,
            type: 'error'
          });
          GetTestHistoriesdetailResult.code=error.code
          GetTestHistoriesdetailResult.msg=error.message
        }
        loading.status=false
    }
    //详情页面：关闭按钮
    const handleClose=(done: () => void)=>{
      //循环销毁图表实例，并初始化
      array_biao.data.every((val: any, idx: any, array: any) => {
        val.value.destroy();
        return true;
      });
      array_biao.data=[]
      title.data=""
      title.type="primary"
      title.text="loading"
      title.loading=true
      title.percentage=0
      title.percentagestatus="exception"
      title.maxtimestamp=0
      //清除定时器，并初始化
      if(tabledetail.intervalId!==-1){
        clearInterval(tabledetail.intervalId);
        tabledetail.intervalId=-1
      }
      //刷新历史记录页面数据
      GetTestHistories(paginationData.currentpage,paginationData.currentpagesize)
      done();
    }
    //分页：改变每页显示条数
    const handleSizeChange=(val:any)=> {
      paginationData.currentpagesize=val
      GetTestHistories(paginationData.currentpage,paginationData.currentpagesize)
    }
    //分页：改变当前页
    const handleCurrentChange=(val:any)=> {
      paginationData.currentpage=val
      GetTestHistories(paginationData.currentpage,paginationData.currentpagesize)
    }
    //Table用 时间戳转换为日期
    const formatdate=(row: any, column: any, cellValue: any, index: any)=>{
        if(cellValue == undefined){return ''};
        return moment(parseInt(cellValue)*1000).format("YYYY-MM-DD HH:mm:ss")
    }
    // 时间戳转日期
    const formatprosdate=(timestampvalue:any)=>{
      if(timestampvalue == undefined){return ''};
        return moment(parseInt(timestampvalue)*1000).format("YYYY-MM-DD HH:mm:ss")
    }
    //渲染CPU图表
    const rendercpu=(cpu_data: any[],array_biao: any)=>{
        cpu_data.forEach((val, index) => {
            let data=val
            //百分比
            const are_cpu = ref({}) as Ref<Area>;
            array_biao.data.push(are_cpu)
            are_cpu.value = new Area(`chart${index}`, {
              data,
              xField: 'timestamp',
              yField: 'value',
              seriesField: 'type',
              color: ['#B8E1FF', '#FF6836'],
              areaStyle: {
                fillOpacity: 0.7,
              },
              appendPadding: 10,
              isPercent: true,
                      yAxis: {
                label: {
                  formatter: (v) => {
                    return parseFloat(v) * 100;
                  }
                },
              },
              slider: {
                start: 0,
                end: 1,
              }
            });
            are_cpu.value.render();
          }) 
    }
    //动态更新CPU图表
    const rendercpu_update=(cpu_data: any[],array_biao: any)=>{
        cpu_data.forEach((val, index) => {
            let data=val
            //折线图
            if(array_biao.data[3+index]===undefined){
              let are_cpu = ref({}) as Ref<Area>;
              array_biao.data.push(are_cpu)
              are_cpu.value = new Area(`chart${index}`, {
                data,
                xField: 'timestamp',
                yField: 'value',
                seriesField: 'type',
                color: ['#B8E1FF', '#FF6836'],
                areaStyle: {
                  fillOpacity: 0.7,
                },
                appendPadding: 10,
                isPercent: true,
                        yAxis: {
                  label: {
                    formatter: (v) => {
                      return parseFloat(v) * 100;
                    }
                  },
                },
                slider: {
                  start: 0,
                  end: 1,
                }
              });
              are_cpu.value.render();
            }else{
              if(array_biao.data[3+index].value){
                  array_biao.data[3+index].value.changeData(data);
              }
            }
          }) 
    }
    //渲染内存图表
    const rendermem=(mem_data: any[],array_biao: any)=>{
      let data=mem_data.sort((a, b) =>{
        return a.sort - b.sort
      } )
      const line_mem = ref({}) as Ref<Line>;
      array_biao.data.push(line_mem)
      line_mem.value = new Line('container_mem', {
          data,
          xField: 'timestamp',
          yField: 'value',
          seriesField: 'type',
          color: ['#57D1A1', '#FF6836'],
          smooth: true,
          slider: {
            start: 0,
            end: 1,
          }
      });
      line_mem.value.render();
    }
    //动态更新内存图表
    const rendermem_update=(mem_data_new: any[],array_biao: any)=>{
      let data=mem_data_new.sort((a, b) =>{
        return a.sort - b.sort
      } )
      array_biao.data[0].value.changeData(data);
    }
    const renderpie=(perdetail:any[],array_biao: any)=>{
       let costmap={
          "0~10ms":0,
          "10~30ms":0,
          "30~50ms":0,
          "50~100ms":0,
          "100~500ms":0,
          "0.5~3s":0,
          "3~5s":0,
          "5~100s":0,
          "<100s":0
       }
       let retcodemap={
          "SUCCESS":0,
          // "1":0,
          // "2":0,
          // "3":0,
          // "4":0,
          // "5":0,
          // "6":0,
          // "7":0,
          // "8":0,
          // "9":0,
          "EXCEPTION":0,
          "INIT_PARAM_ERROR":0,
          "URL_ERROR":0,
          "PACKET_ENCODE_ERROR":0,
          "PACKET_DECODE_ERROR":0,
          "PACKET_PARAM_ERROR":0,
          "SOCK_ERROR":0,
          "SOCK_INVALID":0,
          "SOCK_CONN_ERROR":0,
          "SOCK_CONN_TIMEOUT":0,
          "SOCK_SEND_ERROR":0,
          "SOCK_RECV_ERROR":0,
          "SOCK_RECV_TIMEOUT":0
       }
       perdetail.every((val: any, idx: any, array: any) => {
            // val: 当前值
            // idx：当前index
            // array: Array
            costmap['0~10ms']=costmap['0~10ms']+val.costMap['0~10ms']
            costmap['10~30ms']=costmap['10~30ms']+val.costMap['10~30ms']
            costmap['30~50ms']=costmap['30~50ms']+val.costMap['30~50ms']
            costmap['50~100ms']=costmap['50~100ms']+val.costMap['50~100ms']
            costmap['100~500ms']=costmap['100~500ms']+val.costMap['100~500ms']
            costmap['0.5~3s']=costmap['0.5~3s']+val.costMap['0.5~3s']
            costmap['3~5s']=costmap['3~5s']+val.costMap['3~5s']
            costmap['5~100s']=costmap['5~100s']+val.costMap['5~100s']
            costmap['<100s']=costmap['<100s']+val.costMap['<100s']
            for(let [key, val1] of Object.entries(val.retCodeMap)){
              if(key==="SUCCESS"){
                retcodemap['SUCCESS']=retcodemap['SUCCESS']+Number(val1)
              }
              if(key==="EXCEPTION"){
                retcodemap["EXCEPTION"]=retcodemap["EXCEPTION"]+Number(val1)
              }
              if(key==="INIT_PARAM_ERROR"){
                retcodemap['INIT_PARAM_ERROR']=retcodemap['INIT_PARAM_ERROR']+Number(val1)
              }
              if(key==="URL_ERROR"){
                retcodemap['URL_ERROR']=retcodemap['URL_ERROR']+Number(val1)
              }
              if(key==="PACKET_ENCODE_ERROR"){
                retcodemap['PACKET_ENCODE_ERROR']=retcodemap['PACKET_ENCODE_ERROR']+Number(val1)
              }
              if(key==="PACKET_DECODE_ERROR"){
                retcodemap['PACKET_DECODE_ERROR']=retcodemap['PACKET_DECODE_ERROR']+Number(val1)
              }
              if(key==="PACKET_PARAM_ERROR"){
                retcodemap['PACKET_PARAM_ERROR']=retcodemap['PACKET_PARAM_ERROR']+Number(val1)
              }
              if(key==="SOCK_ERROR"){
                retcodemap['SOCK_ERROR']=retcodemap['SOCK_ERROR']+Number(val1)
              }
              if(key==="SOCK_INVALID"){
                retcodemap['SOCK_INVALID']=retcodemap['SOCK_INVALID']+Number(val1)
              }
              if(key==="SOCK_CONN_ERROR"){
                retcodemap['SOCK_CONN_ERROR']=retcodemap['SOCK_CONN_ERROR']+Number(val1)
              }
              if(key==="SOCK_CONN_TIMEOUT"){
                retcodemap['SOCK_CONN_TIMEOUT']=retcodemap['SOCK_CONN_TIMEOUT']+Number(val1)
              }
              if(key==="SOCK_SEND_ERROR"){
                retcodemap['SOCK_SEND_ERROR']=retcodemap['SOCK_SEND_ERROR']+Number(val1)
              }
              if(key==="SOCK_RECV_ERROR"){
                retcodemap['SOCK_RECV_ERROR']=retcodemap['SOCK_RECV_ERROR']+Number(val1)
              }
              if(key==="SOCK_RECV_TIMEOUT"){
                retcodemap['SOCK_RECV_TIMEOUT']=retcodemap['SOCK_RECV_TIMEOUT']+Number(val1)
              }
            }
            return true; // Continues
        });
        //耗时分布饼图
        let retcostmap=[]
        for(let [key, val] of Object.entries(costmap)){
          retcostmap.push({
            "type": key,
            "value": val
          })
        }
        let data=retcostmap
        const pie_cost = ref({}) as Ref<Pie>;
        array_biao.data.push(pie_cost)
        pie_cost.value = new Pie('container_time_interval', {
          appendPadding: 20,
          data:data,
          angleField: 'value',
          colorField: 'type',
          radius: 0.75,
          label: {
            type: 'spider',
            labelHeight: 28,
            content: '{name}:{percentage}:{value}'
          },
          interactions: [ { type: 'element-active' }],
        });
        pie_cost.value.render();
        //返回值分布饼图
        let retcodemap1=[]
        for(let [key, val] of Object.entries(retcodemap)){
          if(val!==0){
            retcodemap1.push({
              "type": key,
              "value": val
            })
          }
        }
        let data1=retcodemap1
        const pie_retcode = ref({}) as Ref<Pie>;
        array_biao.data.push(pie_retcode)
        pie_retcode.value = new Pie('container_return_value', {
          appendPadding: 20,
          data:data1,
          angleField: 'value',
          colorField: 'type',
          radius: 0.75,
          label: {
            type: 'spider',
            labelHeight: 28,
            content: '{name}:{percentage}:{value}'
          },
          interactions: [ { type: 'element-active' }],
        });
        pie_retcode.value.render();
    }
    const renderpie_update=(perdetail:any[],array_biao: any)=>{
       let costmap={
          "0~10ms":0,
          "10~30ms":0,
          "30~50ms":0,
          "50~100ms":0,
          "100~500ms":0,
          "0.5~3s":0,
          "3~5s":0,
          "5~100s":0,
          "<100s":0
       }
       let retcodemap={
          "SUCCESS":0,
          // "1":0,
          // "2":0,
          // "3":0,
          // "4":0,
          // "5":0,
          // "6":0,
          // "7":0,
          // "8":0,
          // "9":0,
          "EXCEPTION":0,
          "INIT_PARAM_ERROR":0,
          "URL_ERROR":0,
          "PACKET_ENCODE_ERROR":0,
          "PACKET_DECODE_ERROR":0,
          "PACKET_PARAM_ERROR":0,
          "SOCK_ERROR":0,
          "SOCK_INVALID":0,
          "SOCK_CONN_ERROR":0,
          "SOCK_CONN_TIMEOUT":0,
          "SOCK_SEND_ERROR":0,
          "SOCK_RECV_ERROR":0,
          "SOCK_RECV_TIMEOUT":0
       }
       perdetail.every((val: any, idx: any, array: any) => {
            costmap['0~10ms']=costmap['0~10ms']+val.costMap['0~10ms']
            costmap['10~30ms']=costmap['10~30ms']+val.costMap['10~30ms']
            costmap['30~50ms']=costmap['30~50ms']+val.costMap['30~50ms']
            costmap['50~100ms']=costmap['50~100ms']+val.costMap['50~100ms']
            costmap['100~500ms']=costmap['100~500ms']+val.costMap['100~500ms']
            costmap['0.5~3s']=costmap['0.5~3s']+val.costMap['0.5~3s']
            costmap['3~5s']=costmap['3~5s']+val.costMap['3~5s']
            costmap['5~100s']=costmap['5~100s']+val.costMap['5~100s']
            costmap['<100s']=costmap['<100s']+val.costMap['<100s']
            for(let [key, val1] of Object.entries(val.retCodeMap)){
              if(key==="SUCCESS"){
                retcodemap['SUCCESS']=retcodemap['SUCCESS']+Number(val1)
              }
              if(key==="EXCEPTION"){
                retcodemap["EXCEPTION"]=retcodemap["EXCEPTION"]+Number(val1)
              }
              if(key==="INIT_PARAM_ERROR"){
                retcodemap['INIT_PARAM_ERROR']=retcodemap['INIT_PARAM_ERROR']+Number(val1)
              }
              if(key==="URL_ERROR"){
                retcodemap['URL_ERROR']=retcodemap['URL_ERROR']+Number(val1)
              }
              if(key==="PACKET_ENCODE_ERROR"){
                retcodemap['PACKET_ENCODE_ERROR']=retcodemap['PACKET_ENCODE_ERROR']+Number(val1)
              }
              if(key==="PACKET_DECODE_ERROR"){
                retcodemap['PACKET_DECODE_ERROR']=retcodemap['PACKET_DECODE_ERROR']+Number(val1)
              }
              if(key==="PACKET_PARAM_ERROR"){
                retcodemap['PACKET_PARAM_ERROR']=retcodemap['PACKET_PARAM_ERROR']+Number(val1)
              }
              if(key==="SOCK_ERROR"){
                retcodemap['SOCK_ERROR']=retcodemap['SOCK_ERROR']+Number(val1)
              }
              if(key==="SOCK_INVALID"){
                retcodemap['SOCK_INVALID']=retcodemap['SOCK_INVALID']+Number(val1)
              }
              if(key==="SOCK_CONN_ERROR"){
                retcodemap['SOCK_CONN_ERROR']=retcodemap['SOCK_CONN_ERROR']+Number(val1)
              }
              if(key==="SOCK_CONN_TIMEOUT"){
                retcodemap['SOCK_CONN_TIMEOUT']=retcodemap['SOCK_CONN_TIMEOUT']+Number(val1)
              }
              if(key==="SOCK_SEND_ERROR"){
                retcodemap['SOCK_SEND_ERROR']=retcodemap['SOCK_SEND_ERROR']+Number(val1)
              }
              if(key==="SOCK_RECV_ERROR"){
                retcodemap['SOCK_RECV_ERROR']=retcodemap['SOCK_RECV_ERROR']+Number(val1)
              }
              if(key==="SOCK_RECV_TIMEOUT"){
                retcodemap['SOCK_RECV_TIMEOUT']=retcodemap['SOCK_RECV_TIMEOUT']+Number(val1)
              }
            }
            return true; // Continues
        });
        //耗时分布饼图
        let retcostmap=[]
        for(let [key, val] of Object.entries(costmap)){
          retcostmap.push({
            "type": key,
            "value": val
          })
        }
        let data=retcostmap
        array_biao.data[1].value.changeData(data);
        //返回值分布饼图
        let retcodemap1=[]
        for(let [key, val] of Object.entries(retcodemap)){
          if(val!==0){
            retcodemap1.push({
              "type": key,
              "value": val
            })
          }
        }
        let data1=retcodemap1
        array_biao.data[2].value.changeData(data1);
    }
    const percentageformat=(percentage:any)=>{
      return percentage === 100 ? `${percentage.toFixed(2)}%`: `${percentage.toFixed(2)}% ( `+title.remaintime+` s )`
    }
    //保留2位小数
    const format2dot=(row: any, column: any, cellValue: any, index: any)=>{
        if(cellValue == undefined){return ''};
        return cellValue.toFixed(2);
    }
    //格式化压测包大小
    const formatpkgLen=(row: any, column: any, cellValue: any, index: any)=>{
        if(cellValue===undefined){return ''};
        if(cellValue===0){
          return "0K"
        }
        if(cellValue===1*1024){
          return "1K"
        }
        if(cellValue===10*1024){
          return "10K"
        }
        if(cellValue===100*1024){
          return "100K"
        }
        if(cellValue===1024*1024){
          return "1M"
        }
        if(cellValue===5*1024*1024){
          return "5M"
        }
    }
    GetTestHistories(paginationData.currentpage,paginationData.currentpagesize)
    return {
      //变量
      ctx,
      handleSizeChange,
      handleCurrentChange,
      paginationData,
      DoFuncTestresult,
      startform,
      startformrules,
      PerfTestReqruleForm,
      formLabelWidth:'30%',
      FunctionaldialogTableVisible,
      doPerfTestdialogFormVisible,
      GetTestHistoriesResult,
      loading,
      tableData,
      GetTestHistoriesdetailResult,
      tabledetailData,
      tabledetail,
      title,
      clickrow,
      cpu_data,
      array_biao,
      //函数方法
      GetTestHistories,
      doFuncTest,
      StartBenchmark,
      submitForm,
      resetForm,
      handleClick,
      handleClose,
      formatdate,
      formatprosdate,
      rendercpu,
      rendercpu_update,
      rendermem,
      rendermem_update,
      renderpie,
      renderpie_update,
      percentageformat,
      format2dot,
      formatpkgLen
    }
  }
});
</script>
<style>
  .report{
    text-align: center;
  }
  .el-table td,
  .el-table th {
    text-align: center !important;
  }
  .el-table__header col[name="gutter"] {
    display: table-cell !important;
  }
  .demo-table-expand {
    font-size: 0;
    text-align: left;
  }
  .demo-table-expand label {
    width: 100px;
    color: #99a9bf;
    background-color: #f6f8f9;
    text-align: center;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .el-drawer__header{
    font-weight:bold;
  }
  .el-drawer__close{
    background-color: #E7EAED;
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
  .box-card{
    padding-top: 20px;
    text-align: left;
  }
  .tabcontent{
    height: calc(100vh - 87px);
  }
  .pdt10{
    padding-top: 10px;
  }
</style>