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
          {{ scope.row.paymentId }}
        </template>
      </el-table-column>
      <el-table-column label="Payment Type" align="center">
        <template slot-scope="scope">
          {{ scope.row.paymentType }}
        </template>
      </el-table-column>
      <el-table-column label="Invoice Id" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.invoiceId }}
        </template>
      </el-table-column>
      <el-table-column label="Edit" width="80" align="center" v-if="role === 'admin'">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle plain @click="editHandle(scope.row.paymentId)" />
        </template>
      </el-table-column>
      <el-table-column label="Delete" width="80" align="center" v-if="role === 'admin'">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" circle plain @click="deleteHandle(scope.row.paymentId)" />
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
          <el-input v-model.number="form.paymentId" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Payment Type">
          <el-input v-model="form.paymentType" />
        </el-form-item>
        <el-form-item label="Invoice Id">
          <el-input v-model="form.invoiceId" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(form.paymentId)">Submit</el-button>
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
import { getCustomerId, getUserRole, homePayment, request, sendAxios, getFetchAxios } from '@/utils/global';

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
        paymentId: '',
        paymentType: '',
        invoiceId: ''
      },
      role: getUserRole(this),
      cId: getCustomerId(this),
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      return getFetchAxios(this, homePayment);
    },
    addHandle() {
      console.log('Add');
      this.editbox = true;
      this.disableInput = false;
      this.editing = -1;
      this.form.paymentId = '';
      this.form.paymentType = '';
      this.form.invoiceId = '';
    },
    getObject(id) {
      for (let i = 0; i < this.list.length; i++) {
        if (id === this.list[i].paymentId) {
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
      this.form.paymentId = form.paymentId;
      this.form.paymentType = form.paymentType;
      this.form.invoiceId = form.invoiceId;
    },
    deleteHandle(id) {
      console.log('Delete: ' + id);
      this.dialogVisible = true;
      this.editing = id;
    },
    onSubmit() {
      console.log(this.form);
      const param = new URLSearchParams();
      param.append('paymentId', this.form.paymentId);
      param.append('paymentType', this.form.paymentType);
      param.append('invoiceId', this.form.invoiceId);
      if (this.disableInput === true) {
        sendAxios(this,request(homePayment.update) + this.form.paymentId, param)
      } else {
        sendAxios(this,request(homePayment.add), param)
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
      param.append('paymentId', this.form.paymentId);
      sendAxios(this, request(homePayment.delete) + this.editing,param);
    }
  }
};
</script>
