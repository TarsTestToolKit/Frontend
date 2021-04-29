<template>
  <div class="report">
    <h1 style="text-align: center;">Test Report</h1>
    <el-button type="primary" @click="GetTestHistories" plain>GetData</el-button>
  </div>
  <div v-loading="loading.status">
      <!-- 无数据时 -->
      <el-empty description="No Data" v-if="GetTestHistoriesResult.code==-1"></el-empty>
      <!-- 有数据时 -->
      <!-- 自适应栅格 -->
      <el-row style="padding-top:20px;">
        <el-col :span="1"></el-col>
        <el-col :span="22">
          <el-table v-if="GetTestHistoriesResult.code!=-1" :default-sort="{prop: 'startTime', order: 'ascending'}" :data="tableData.data" border stripe style="width: 100%;" :header-cell-style="{background:'#F9FAFC'}" >
            <!-- <el-table-column type="expand" border>
              <template #default="props">
                <el-form label-position="left" inline class="demo-table-expand" border>
                  <el-form-item label="testID">
                    <span>{{ props.row.testID }}</span>
                  </el-form-item>
                  <el-form-item label="lang">
                    <span>{{ props.row.lang }}</span>
                  </el-form-item>
                  <el-form-item label="startTime">
                    <span>{{ formatprosdate(props.row.startTime) }}</span>
                  </el-form-item>
                  <el-form-item label="endTime">
                    <span>{{ formatprosdate(props.row.endTime) }}</span>
                  </el-form-item>
                  <el-form-item label="servType">
                    <span>{{ props.row.servType }}</span>
                  </el-form-item>
                  <el-form-item label="connCnt">
                    <span>{{ props.row.connCnt }}</span>
                  </el-form-item>
                  <el-form-item label="cores">
                    <span>{{ props.row.cores }}</span>
                  </el-form-item>
                  <el-form-item label="keepAlive">
                    <span>{{ props.row.keepAlive }}</span>
                  </el-form-item>
                  <el-form-item label="pkgLen">
                    <span>{{ props.row.pkgLen }}</span>
                  </el-form-item>
                  <el-form-item label="threads">
                    <span>{{ props.row.threads }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column> -->
            <el-table-column prop="testID" label="testID" sortable :sort-orders="['ascending', 'descending']"> </el-table-column>
            <el-table-column prop="startTime" label="startTime" :formatter="formatdate" sortable :sort-orders="['ascending', 'descending']"> </el-table-column>
            <!-- <el-table-column prop="endTime" label="endTime" :formatter="formatdate"> </el-table-column> -->
            <!-- <el-table-column prop="lang" label="lang"> </el-table-column> -->
            <el-table-column prop="servType" label="servType" sortable :sort-orders="['ascending', 'descending']"> </el-table-column>
            <el-table-column label="DetailInfo" fixed="right">
              <template #default="scope">
                <el-button @click="handleClick(scope.$index, scope.row)" type="text" size="small">
                  Detail
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="1"></el-col>
      </el-row>
  </div>
  
  <el-drawer
    v-model="tabledetail.status"
    direction="btt"
    :append-to-body="true"
    :title="title.data"
    
    size="100%">
    <el-tabs type="border-card">
      <el-tab-pane label="BenchmarkParameter">
        <el-row style="padding-top:20px;">
          <el-col :span="2"></el-col>
          <el-col :span="4">
              <div>
                lang
                <el-input
                  v-model="clickrow.lang"
                  :disabled="true">
                </el-input>
              </div>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="4">
              <div>
                servType
                <el-input
                  v-model="clickrow.servType"
                  :disabled="true">
                </el-input>
              </div>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="4">
              <div>
                threads
                <el-input
                  v-model="clickrow.threads"
                  :disabled="true">
                </el-input>
              </div>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="4">
              <div>
                cores
                <el-input
                  v-model="clickrow.cores"
                  :disabled="true">
                </el-input>
              </div>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="2"></el-col>
        </el-row>
        <el-row style="padding-top:20px;">
          <el-col :span="2"></el-col>
          <el-col :span="4">
              <div>
                connCnt
                <el-input
                  v-model="clickrow.connCnt"
                  :disabled="true">
                </el-input>
              </div>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="4">
              <div>
                reqFreq
                <el-input
                  v-model="clickrow.reqFreq"
                  :disabled="true">
                </el-input>
              </div>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="4">
              <div>
                keepAlive
                <el-input
                  v-model="clickrow.keepAlive"
                  :disabled="true">
                </el-input>
              </div>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="4">
              <div>
                pkgLen
                <el-input
                  v-model="clickrow.pkgLen"
                  :disabled="true">
                </el-input>
              </div>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="2"></el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="24">
              <div id="container_mem"></div>
          </el-col>
        </el-row>
        <el-row>
              <el-col v-for="(item,index) in cpu_data" :key="index" :span="12">
                <h4>CPU-{{index+1}}</h4>
                <div :id="`chart${index}`" style="width:100%">
                </div>
              </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
              <h4>Return value distribution</h4>
              <div id="container_return_value" style="width:100%"></div>
          </el-col>  
          <el-col :span="12">
              <h4>Time interval distribution</h4>
              <div id="container_time_interval" style="width:100%"></div>
          </el-col>
        </el-row> -->
      </el-tab-pane>
      <el-tab-pane label="perfDetail">
        <el-table :data="tabledetailData.perfDetail" border :header-cell-style="{background:'#F9FAFC'}" :default-sort="{prop: 'timestamp', order: 'ascending'}">
            <el-table-column property="timestamp" label="timestamp" :formatter="formatdate" sortable :sort-orders="['ascending', 'descending']"></el-table-column>
            <el-table-column property="totalReq" label="totalReq"></el-table-column>
            <el-table-column property="succRate" label="succRate"></el-table-column>
            <el-table-column property="succ" label="succ"></el-table-column>
            <el-table-column property="sendByte" label="sendByte"></el-table-column>
            <el-table-column property="recvByte" label="recvByte"></el-table-column>
            <el-table-column property="qps" label="qps"></el-table-column>
            <el-table-column property="p90" label="p90"></el-table-column>
            <el-table-column property="p99" label="p99"></el-table-column>
            <el-table-column property="p999" label="p999"></el-table-column>
            <el-table-column property="failed" label="failed"></el-table-column>
            <el-table-column property="costMax" label="costMax"></el-table-column>
            <el-table-column property="costMin" label="costMin"></el-table-column>
            <el-table-column property="costAvg" label="costAvg"></el-table-column>
            <!-- <el-table-column property="costMap" label="costMap" :formatter="arr2str"></el-table-column>
            <el-table-column property="retCodeMap" label="retCodeMap" :formatter="arr2str"></el-table-column> -->
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="perfDetail-piedata">
        <el-table :data="tabledetailData.perfDetail" border :header-cell-style="{background:'#F9FAFC'}" :default-sort="{prop: 'timestamp', order: 'ascending'}">
            <el-table-column property="timestamp" label="timestamp" :formatter="formatdate" sortable :sort-orders="['ascending', 'descending']"></el-table-column>
            <el-table-column property="costMap" label="costMap" :formatter="arr2str"></el-table-column>
            <el-table-column property="retCodeMap" label="retCodeMap" :formatter="arr2str"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="resUsage">
        <el-table :data="tabledetailData.resUsage" border :header-cell-style="{background:'#F9FAFC'}" :default-sort="{prop: 'timestamp', order: 'ascending'}">
            <el-table-column property="timestamp" label="timestamp" :formatter="formatdate" sortable :sort-orders="['ascending', 'descending']"></el-table-column>
            <el-table-column property="cpu" label="cpu" :formatter="arr2str"></el-table-column>
            <el-table-column property="mem" label="mem" :formatter="arr2str"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="mem">
        <el-row>
          <el-col :span="24">
              <div id="container_mem"></div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="cpu">
        <el-row>
              <el-col v-for="(item,index) in cpu_data" :key="index" :span="12">
                <h4>CPU-{{index+1}}</h4>
                <div :id="`chart${index}`" style="width:100%">
                </div>
              </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="Interval distribution">
        <el-row>
          <el-col :span="12">
              <h4>Return value distribution</h4>
              <div id="container_return_value" style="width:100%"></div>
          </el-col>  
          <el-col :span="12">
              <h4>Time interval distribution</h4>
              <div id="container_time_interval" style="width:100%"></div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>
<script lang="ts">
//引入axios
import axios from 'axios'
import moment from 'moment'
import {  getCurrentInstance,reactive,ref, toRefs } from "vue";
import { useRouter, useRoute } from 'vue-router'
import { Area,Line,Pie } from '@antv/g2plot';
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
    const router = useRouter()
    const route = useRoute()
    //详情drawer左上角标题
    const title = reactive({ 
      data: "" 
    })
    
    //详情按钮获取行数据
    const clickrow = reactive({ 
      testID: "",
      lang:"",
      servType: "",
      threads: "",
      cores: "",
      connCnt: "",
      reqFreq: "",
      keepAlive: "",
      pkgLen: "",
    })
    const { ctx }: any = getCurrentInstance();
    // 历史记录按钮加载状态
    const loading = reactive({ 
      status: false 
    })
    // 详情按钮加载状态
    const tabledetail = reactive({ 
      status: false 
    })
    // 历史记录
    const tableData = reactive({ 
      data: []
    })
    // 详情按钮数据
    const tabledetailData = reactive({ 
      perfDetail: [],
      resUsage:[],
      cpu:[],
      mem:[]
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
    //初始化获取历史记录按钮
    const  GetTestHistories = async () => {
      loading.status=true
      try {
        const response = await axios.get('http://3tkapi1.zhaoguolei.com:8000/histories');
        console.log(response);
        GetTestHistoriesResult.code=response.data.code
        GetTestHistoriesResult.msg=response.data.msg
        GetTestHistoriesResult.histories=response.data.histories
        tableData.data=response.data.histories
      } catch (error) {
        //console.log(error.message);
        //console.log(error.code);
        GetTestHistoriesResult.code=error.code
        GetTestHistoriesResult.msg=error.message
        GetTestHistoriesResult.histories=error.histories
      }
      loading.status=false
    }
    const drawerhandleClose=(done: any)=>{
      const { ctx }: any = getCurrentInstance();
      ctx.men_area.destroy();
      done();
    }
    //定义CPU数据变量
    const cpu_data = new Array()
    //详情按钮
    const handleClick=async(index: any, row: any) =>{
        //router.push({ name: 'Detail', params: { testID: row.testID } })
        tabledetail.status=true
        //console.log(index);
        //console.log(row.testID)
        title.data="testID:"+row.testID;
        clickrow.testID=row.testID
        clickrow.lang=row.lang
        clickrow.servType=row.servType
        clickrow.threads=row.threads
        clickrow.cores=row.cores
        clickrow.connCnt=row.connCnt
        clickrow.reqFreq=row.reqFreq
        clickrow.keepAlive=row.keepAlive
        clickrow.pkgLen=row.pkgLen
        loading.status=true
        try {
          const response = await axios.get('http://3tkapi1.zhaoguolei.com:8000/detail',{
            params: {
              test_id: row.testID
            }
          });
          console.log(response);
          GetTestHistoriesdetailResult.code=response.data.code
          GetTestHistoriesdetailResult.msg=response.data.msg
          GetTestHistoriesdetailResult.perfDetail=response.data.perfDetail
          GetTestHistoriesdetailResult.resUsage=response.data.resUsage
          tabledetailData.perfDetail=response.data.perfDetail
          tabledetailData.resUsage=response.data.resUsage
          tabledetailData.cpu=response.data.resUsage.cpu
          tabledetailData.mem=response.data.resUsage.mem
          let datatem = ctx.tabledetailData.resUsage
          let dataperfdetail=ctx.tabledetailData.perfDetail
          //定义内存局部变量mem_data
          let mem_data: { type: string;sort: any; timestamp: any; value: any; }[]=new Array()
          //定义内存局部变量mem_data
          let costmap_data: { type: string; value: any; }[]=new Array()
          // dataperfdetail.every((val: any, idx: any, array: any) => {

          //   //console.log(val.costMap)
          //   let tem_key=""
          //   let tem_val=0
          //   for(let key in val.costMap){
          //     //console.log(key)
          //     //console.log(val.costMap[key])
          //     tem_key=key
          //     tem_val=tem_val+val.costMap[key]
              
          //   }
          //   costmap_data.push(
          //       {
          //         "type": tem_key,
          //         "value": tem_val
          //       }
          //   )
          //   return true;
          // });
          // console.log(ctx.trans(costmap_data))
          //定义内存局部变量mem_data
          let retcodemap_data: { type: string;sort: any; timestamp: any; value: any; }[]=new Array()
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
                  "timestamp": ctx.formatprosdate(val.timestamp),
                  "value": parseFloat(total_str)
                }
              )
              mem_data.push(
                {
                  "type": "used ( GB )",
                  "sort":val.timestamp,
                  "timestamp": ctx.formatprosdate(val.timestamp),
                  "value": parseFloat(used_str)
                }
              )
              
              return true; // Continues
              // Return false will quit the iteration
          });
          //2秒后渲染内存多折线图
          //setTimeout(() => {
            ctx.rendermem(mem_data)
          //}, 1000);
          //2秒后渲染pie饼图
          // setTimeout(() => {
          //   ctx.renderpie(tabledetailData.perfDetail)
          // }, 2000);
          //加工处理后台接口返回CPU数据
          for(let i=0;i<=datatem[0].cpu.length-1;i++){
            let cpu_data_temp=new Array()
            datatem.every((val: any, idx: any, array: any) => {
                // val: 当前值
                // idx：当前index
                // array: Array
                cpu_data_temp.push(
                  {
                    "type":"free",
                    "sort":val.timestamp,
                    "timestamp": ctx.formatprosdate(val.timestamp),
                    "value": (1-val.cpu[i].percent)*100
                  }
                )
                cpu_data_temp.push(
                  {
                    "type":"used",
                    "sort":val.timestamp,
                    "timestamp": ctx.formatprosdate(val.timestamp),
                    "value": (val.cpu[i].percent)*100
                  }
                )
                
                if(idx+1==datatem.length){
                  cpu_data.push(cpu_data_temp.sort((a, b) =>{
                    return a.sort - b.sort
                  } ))
                }
                return true; // Continues
                // Return false will quit the iteration
            });
          }
          //console.log(cpu_data)
          //2秒后渲染CPU百分比面积图
          setTimeout(() => {
            ctx.rendercpu(cpu_data)
          }, 2000);
          
          //加工处理后台接口返回costMap
          //console.log(tabledetailData.perfDetail)
          // let costMap_data = ctx.tabledetailData.perfDetail.costMap
          // costMap_data.every((val: any, idx: any, array: any) => {
          //       // val: 当前值
          //       // idx：当前index
          //       // array: Array
          //       console.log(val)
          //       console.log(idx)
          //       console.log(array)
          //       return true; // Continues
          //       // Return false will quit the iteration
          //   });
            
        } catch (error) {
          //console.log(error);
          //console.log(error.message);
          //console.log(error.code);
          GetTestHistoriesdetailResult.code=error.code
          GetTestHistoriesdetailResult.msg=error.message
        }
        loading.status=false
    }
    
    return {
      GetTestHistories,
      GetTestHistoriesResult,
      loading,
      tableData,
      GetTestHistoriesdetailResult,
      tabledetailData,
      tabledetail,
      handleClick,
      title,
      clickrow,
      drawerhandleClose,
      cpu_data
    }
  },
  methods: {
    //Table用 时间戳转换为日期
    formatdate(row: any, column: any, cellValue: any, index: any){
        //console.log(row);
        //console.log(column)
        //console.log(cellValue);
        //console.log( moment(cellValue*1000).format());
        //console.log(index)
        if(cellValue == undefined){return ''};
        return moment(parseInt(cellValue)*1000).format("YYYY-MM-DD HH:mm:ss")
    },
    // 时间戳转日期
    formatprosdate(timestampvalue:any){
      if(timestampvalue == undefined){return ''};
        return moment(parseInt(timestampvalue)*1000).format("YYYY-MM-DD HH:mm:ss")
    },
    //数组转字符串
    arr2str(row: any, column: any, cellValue: any, index: any){
      return JSON.stringify(cellValue)
    },
    //渲染CPU图表
    rendercpu(cpu_data: any[]){
        cpu_data.forEach((val, index) => {
            //console.log(val)
            //console.log(index)
            let data=val
            //折线图
            // const line = new Line(`chart${index}`, {
            //   data,
            //   xField: 'timestamp',
            //   yField: 'value',
            //   seriesField: 'type'
            // });
            // line.render();
            //百分比
            const area = new Area(`chart${index}`, {
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
            area.render();
          }) 
    },
    //渲染内存图表
    rendermem(mem_data: any[]){
      //console.log(mem_data)
      let data=mem_data.sort((a, b) =>{
        return a.sort - b.sort
      } )
      const line = new Line('container_mem', {
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
      line.render();
    },
    renderpie(perdetail:any[]){
       //console.log(perdetail)
       perdetail.every((val: any, idx: any, array: any) => {
            // val: 当前值
            // idx：当前index
            // array: Array
            console.log(val)
            console.log(idx)
            console.log(array)
            return true; // Continues
            // Return false will quit the iteration
        });
    },
    trans (arr: { name: any; value: any; }[]) {
      let obj:any = {}
      let result: { name: any; value: any; }[] = []
      arr.forEach(({name, value}) => {
        let cur = obj[name]
        if (cur) {
          let index = cur.index
          result[index].value += value
        } else {
          let index = result.length
          obj[name] = {
            name,
            index
          }
          result.push({name, value})
        }
      })
      return result
    }
      
  },
  mounted () {

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
  /*1.显示滚动条：当内容超出容器的时候，可以拖动：*/
.el-drawer__body, .el-tabs__content{
   overflow: auto;
}
.el-tabs__content::-webkit-scrollbar,
.el-drawer__body::-webkit-scrollbar {
width : 10px;
height: 1px;
}
.el-tabs__content::-webkit-scrollbar-thumb,
.el-drawer__body::-webkit-scrollbar-thumb {
border-radius   : 10px;
background-color: skyblue;
background-image: -webkit-linear-gradient(
  315deg,
  rgba(255, 255, 255, 0.2) 25%,
  transparent 25%,
  transparent 50%,
  rgba(255, 255, 255, 0.2) 50%,
  rgba(255, 255, 255, 0.2) 75%,
  transparent 75%,
  transparent
);
}
.el-tabs__content::-webkit-scrollbar-track,
.el-drawer__body::-webkit-scrollbar-track {
box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
background   : #ededed;
border-radius: 10px;
}
/*2.隐藏滚动条，太丑了*/
/* .el-drawer__container ::-webkit-scrollbar{
    display: none;
} */
.el-drawer__header{
  font-weight:bold;
}
</style>