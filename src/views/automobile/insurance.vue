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
          {{ scope.row.customerId }}
        </template>
      </el-table-column>
      <el-table-column label="Insurance ID" align="center">
        <template slot-scope="scope">
          {{ scope.row.aiId }}
        </template>
      </el-table-column>
      <el-table-column label="Start Date" align="center">
        <template slot-scope="scope">
          {{ getDateFromDate(scope.row.startDate) }}
        </template>
      </el-table-column>
      <el-table-column label="End Date" align="center">
        <template slot-scope="scope">
          {{ getDateFromDate(scope.row.endDate) }}
        </template>
      </el-table-column>
      <el-table-column label="Premium Amount" align="center">
        <template slot-scope="scope">
          {{ scope.row.premiumAmount }}
        </template>
      </el-table-column>
      <el-table-column label="Status" width="110" align="center">
        <template slot-scope="scope">
          {{ getStatus(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="Edit" width="80" align="center" v-if="role === 'admin'">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle plain @click="editHandle(scope.row.customerId)" />
        </template>
      </el-table-column>
      <el-table-column label="Delete" width="80" align="center" v-if="role === 'admin'">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" circle plain @click="deleteHandle(scope.row.customerId)" />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="Edit Box"
      :visible.sync="editbox"
      width="30%"
    >
      <el-form ref="form" :model="form" label-width="150px">
        <el-form-item label="Customer ID">
          <el-input v-model="form.customerId" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Insurance ID">
          <el-input v-model="form.aiId" />
        </el-form-item>
        <el-form-item label="Start Date">
          <el-date-picker
            v-model="form.startDate"
            type="date"
            placeholder="Select Date"
          />
        </el-form-item>
        <el-form-item label="End Date">
          <el-date-picker
            v-model="form.endDate"
            type="date"
            placeholder="Select Date"
          />
        </el-form-item>
        <el-form-item label="Premium Amount">
          <el-input v-model="form.premiumAmount" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="form.status" placeholder="Select Status">
            <el-option
              v-for="item in statuses"
              :key="item.index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
  aiCustomer,
  getCustomerId,
  getDateFromDate,
  getFetchAxios,
  getUserRole,
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
      statuses: [
        { value: 'C', label: 'Current' },
        { value: 'P', label: 'Expired' }
      ],
      editbox: false,
      dialogVisible: false,
      editing: -1,
      disableInput: true,
      form: {
        customerId: '',
        aiId: '',
        startDate: '',
        endDate: '',
        premiumAmount: '',
        status: '',
      },
      role: getUserRole(this),
      cId: getCustomerId(this),
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    getDateFromDate(date) {
      return getDateFromDate(date);
    },
    fetchData() {
      getFetchAxios(this, aiCustomer);
    },
    getStatus(c) {
      if (c === 'C') {
        return 'Current';
      }
      if (c === 'P') {
        return 'Expired';
      }
    },
    addHandle() {
      console.log('Add');
      this.editbox = true;
      this.disableInput = false;
      this.editing = -1;
      this.form.customerId = '';
      this.form.aiId = '';
      this.form.startDate = '';
      this.form.endDate = '';
      this.form.premiumAmount = '';
      this.form.status = '';
    },
    getObject(id) {
      for (let i = 0; i < this.list.length; i++) {
        if (id === this.list[i].customerId) {
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
      this.form.customerId = form.customerId;
      this.form.aiId = form.aiId;
      this.form.startDate = form.startDate;
      this.form.endDate = form.endDate;
      this.form.premiumAmount = form.premiumAmount;
      this.form.status = form.status;
    },
    deleteHandle(id) {
      console.log('Delete: ' + id);
      this.dialogVisible = true;
      this.editing = id;
    },
    onSubmit() {
      if (this.form.customerId !== this.cId) {
        this.$message.error('Wrong Customer ID');
        return;
      }
      console.log(this.form);
      const param = new URLSearchParams();
      param.append('customerId', this.form.customerId);
      param.append('aiId', this.form.aiId);
      param.append('startDate', getDateFromDate(this.form.startDate));
      param.append('endDate', getDateFromDate(this.form.endDate));
      param.append('premiumAmount', this.form.premiumAmount);
      param.append('status', this.form.status);
      if (this.disableInput === true) {
        sendAxios(this, request(aiCustomer.update) + this.editing, param)
      } else {
        sendAxios(this, request(aiCustomer.add), param)
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
      param.append('automobileId', this.editing);
      sendAxios(this, request(aiCustomer.delete) + this.editing, param);
    }
  }
};
</script>
