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
          {{ scope.row.invoiceId }}
        </template>
      </el-table-column>
      <el-table-column label="Start Date" align="center">
        <template slot-scope="scope">
          {{ getDate(scope.row.date) }}
        </template>
      </el-table-column>
      <el-table-column label="Payment Due Date" align="center">
        <template slot-scope="scope">
          {{ getDate(scope.row.paymentDueDate) }}
        </template>
      </el-table-column>
      <el-table-column label="Invoice Amount" align="center">
        <template slot-scope="scope">
          {{ scope.row.invoiceAmount }}
        </template>
      </el-table-column>
      <el-table-column label="Insurance Customer" align="center">
        <template slot-scope="scope">
          {{ scope.row.hiId }}
        </template>
      </el-table-column>
      <el-table-column label="Edit" width="80" align="center" v-if="role === 'admin'">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle plain @click="editHandle(scope.row.invoiceId)" />
        </template>
      </el-table-column>
      <el-table-column label="Delete" width="80" align="center" v-if="role === 'admin'">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" circle plain @click="deleteHandle(scope.row.invoiceId)" />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="Edit Box"
      :visible.sync="editbox"
      width="30%"
    >
      <el-form ref="form" :model="form" label-width="150px">
        <el-form-item label="Invoice ID">
          <el-input v-model="form.invoiceId" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Start Date">
          <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="Select Date"
          />
        </el-form-item>
        <el-form-item label="Payment Due Date">
          <el-date-picker
            v-model="form.paymentDueDate"
            type="date"
            placeholder="Select Date"
          />
        </el-form-item>
        <el-form-item label="Insurance Amount">
          <el-input v-model="form.invoiceAmount" />
        </el-form-item>
        <el-form-item label="Insurance Customer">
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
import { getCustomerId, getFetchAxios, getUserRole, homeInvoice, request, sendAxios } from '@/utils/global';
import { getDate, getDateFromDate } from '@/utils/global';

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
      editbox: false,
      dialogVisible: false,
      editing: -1,
      disableInput: true,
      form: {
        invoiceId: '',
        date: '',
        paymentDueDate: '',
        invoiceAmount: '',
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
    getDate(timeStamp) {
      return getDate(timeStamp);
    },
    fetchData() {
      getFetchAxios(this, homeInvoice)
    },
    addHandle() {
      console.log('Add');
      this.editbox = true;
      this.disableInput = false;
      this.editing = -1;
      this.form.invoiceId = '';
      this.form.date = '';
      this.form.paymentDueDate = '';
      this.form.invoiceAmount = '';
      this.form.hiId = '';
    },
    getObject(id) {
      for (let i = 0; i < this.list.length; i++) {
        if (id === this.list[i].invoiceId) {
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
      this.form.invoiceId = form.invoiceId;
      this.form.date = form.date;
      this.form.paymentDueDate = form.paymentDueDate;
      this.form.invoiceAmount = form.invoiceAmount;
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
      param.append('invoiceId', this.form.invoiceId);
      param.append('date', getDateFromDate(this.form.date));
      param.append('paymentDueDate', getDateFromDate(this.form.paymentDueDate));
      param.append('invoiceAmount', this.form.invoiceAmount);
      param.append('hiId', this.form.hiId);
      if (this.disableInput === true) {
        sendAxios(this,request(homeInvoice.update) + this.editing, param)
      } else {
        sendAxios(this,request(homeInvoice.add), param)
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
      param.append('invoiceId', this.editing);
      sendAxios(this, request(homeInvoice.delete) + this.editing,param);
    }
  }
};
</script>
