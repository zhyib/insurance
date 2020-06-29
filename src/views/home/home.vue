<template>
  <div class="app-container">
    <div>
      <el-button type="primary" plain @click="addHandle()">Add</el-button>
    </div>
    <br>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.homeId }}
        </template>
      </el-table-column>
      <el-table-column label="Purchase Date" align="center">
        <template slot-scope="scope">
          {{ getDateFromDate(scope.row.purchaseDate) }}
        </template>
      </el-table-column>
      <el-table-column label="Purchase Value" align="center">
        <template slot-scope="scope">
          {{ scope.row.purchaseValue }}
        </template>
      </el-table-column>
      <el-table-column label="Area" align="center">
        <template slot-scope="scope">
          {{ scope.row.area }}
        </template>
      </el-table-column>
      <el-table-column label="Type" align="center">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column label="Fire Notification" align="center">
        <template slot-scope="scope">
          <span>{{ get01(scope.row.autoFireNotification) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Security System" align="center">
        <template slot-scope="scope">
          {{ get01(scope.row.homeSecuritySystem) }}
        </template>
      </el-table-column>
      <el-table-column label="Swimming Pool" align="center">
        <template slot-scope="scope">
          {{ scope.row.swimmingPool }}
        </template>
      </el-table-column>
      <el-table-column label="Basement" align="center">
        <template slot-scope="scope">
          {{ get01(scope.row.basement) }}
        </template>
      </el-table-column>
      <el-table-column label="Edit" width="80" align="center" v-if="role === 'admin'">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle plain @click="editHandle(scope.row.homeId)" />
        </template>
      </el-table-column>
      <el-table-column label="Delete" width="80" align="center" v-if="role === 'admin'">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" circle plain @click="deleteHandle(scope.row.homeId)" />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="Edit Box"
      :visible.sync="editbox"
      width="30%"
    >
      <el-form ref="form" :model="form" label-width="150px">
        <el-form-item label="Automobile ID">
          <el-input v-model="form.homeId" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Purchase Date">
          <el-date-picker
            v-model="form.purchaseDate"
            type="date"
            placeholder="Select Date"
          />
        </el-form-item>
        <el-form-item label="Purchase Value">
          <el-input v-model="form.purchaseValue" />
        </el-form-item>
        <el-form-item label="Area">
          <el-input v-model="form.area" />
        </el-form-item>
        <el-form-item label="Type">
          <el-select v-model="form.type" placeholder="Select Type">
            <el-option
              v-for="item in types"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Fire Notification">
          <el-select v-model="form.autoFireNotification" placeholder="Select">
            <el-option
              v-for="item in yesOrNo"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Security System">
          <el-select v-model="form.homeSecuritySystem" placeholder="Select">
            <el-option
              v-for="item in yesOrNo"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Swimming Pool">
          <el-select v-model="form.swimmingPool" placeholder="Select Year">
            <el-option
              v-for="item in swimmingPools"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Basement">
          <el-select v-model="form.basement" placeholder="Select">
            <el-option
              v-for="item in yesOrNo"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Insurance ID">
          <el-input v-model="form.hiId" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">Submit</el-button>
          <el-button @click="onCancel">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="Confirmation"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>Delete this record?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onCancel()">Cancel</el-button>
        <el-button type="danger" @click="onDelete()">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCustomerId,
  getDateFromDate,
  getFetchAxios,
  getUserRole,
  home,
  request,
  sendAxios
} from '@/utils/global';

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      types: [
        { value: 'S', label: 'Single family' },
        { value: 'M', label: 'Multi family' },
        { value: 'C', label: 'Condominium' },
        { value: 'T', label: 'Town house' }
      ],
      swimmingPools: [
        { value: 'U', label: 'Underground swimming pool' },
        { value: 'O', label: 'Overground swimming pool' },
        { value: 'I', label: 'Indoor swimming pool' },
        { value: 'M', label: 'Multiple Swimming Pool' },
        { value: 'null', label: 'No Swimming Pool' }
      ],
      yesOrNo: [
        { value: 1, label: 'YES'},
        { value: 1, label: 'NO'}
      ],
      editbox: false,
      dialogVisible: false,
      editing: -1,
      disableInput: true,
      form: {
        homeId: '',
        purchaseDate: '',
        purchaseValue: '',
        area: '',
        type: '',
        autoFireNotification: '',
        homeSecuritySystem: '',
        swimmingPool: '',
        basement: '',
        hiId: ''
      },
      role: getUserRole(this),
      cId: getCustomerId(this)
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    get01(data) {
      if (data === 0) {
        return 'NO';
      } else {
        return 'YES';
      }
    },
    getDateFromDate(date) {
      return getDateFromDate(date);
    },
    fetchData() {
      getFetchAxios(this, home);
    },
    getType(c) {
      if (c === 'S') {
        return 'Single family';
      }
      if (c === 'M') {
        return 'Multi Family';
      }
      if (c === 'C') {
        return 'Condominium';
      }
      if (c === 'T') {
        return 'Town house';
      }
    },
    getSwimmingPool(c) {
      if (c === 'U') {
        return 'Underground swimming pool';
      }
      if (c === 'O') {
        return 'Overground swimming pool';
      }
      if (c === 'I') {
        return 'Indoor swimming pool';
      }
      if (c === 'M') {
        return 'Multiple Swimming Pool';
      }
      if (c === 'null') {
        return 'No Swimming Pool';
      }
    },
    addHandle() {
      console.log('Add');
      this.editbox = true;
      this.disableInput = false;
      this.editing = -1;
      this.form.homeId = '';
      this.form.purchaseDate = '';
      this.form.purchaseValue = '';
      this.form.area = '';
      this.form.type = '';
      this.form.autoFireNotification = '';
      this.form.homeSecuritySystem = '';
      this.form.swimmingPool = '';
      this.form.basement = '';
      this.form.hiId = '';
    },
    getObject(id) {
      for (let i = 0; i < this.list.length; i++) {
        if (id === this.list[i].homeId) {
          return this.list[i];
        }
      }
    },
    editHandle(id) {
      console.log('Edit: ' + id);
      this.editbox = true;
      this.disableInput = true;
      this.editing = id;
      let form = this.getObject(id);
      this.form.homeId = form.homeId;
      this.form.purchaseDate = form.purchaseDate;
      this.form.purchaseValue = form.purchaseValue;
      this.form.area = form.area;
      this.form.type = form.type;
      this.form.autoFireNotification = form.autoFireNotification;
      this.form.homeSecuritySystem = form.homeSecuritySystem;
      this.form.swimmingPool = form.swimmingPool;
      this.form.basement = form.basement;
      this.form.hiId = form.hiId;
    },
    deleteHandle(id) {
      console.log('Delete: ' + id);
      this.dialogVisible = true;
      this.editing = id;
    },
    onSubmit() {
      console.log(this.form);
      const param = new URLSearchParams();
      param.append('homeId', this.form.homeId);
      param.append('purchaseDate', getDateFromDate(this.form.purchaseDate));
      param.append('purchaseValue', this.form.purchaseValue);
      param.append('area', this.form.area);
      param.append('type', this.form.type);
      param.append('autoFireNotification', this.form.autoFireNotification);
      param.append('homeSecuritySystem', this.form.homeSecuritySystem);
      param.append('swimmingPool', this.form.swimmingPool);
      param.append('basement', this.form.basement);
      param.append('hiId', this.form.hiId);
      if (this.disableInput === true) {
        sendAxios(this, request(home.update) + this.editing, param)
      } else {
        sendAxios(this, request(home.add), param)
      }
    },
    onCancel() {
      this.editbox = false;
      this.dialogVisible = false;
      this.$message('Cancelled');
    },
    onDelete() {
      this.dialogVisible = false;
      const param = new URLSearchParams();
      param.append('homeId', this.editing);
      sendAxios(this, request(home.delete) + this.editing, param);
    }
  }
};
</script>
