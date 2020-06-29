<template>
  <div class="app-container">
    <br>
    <br>
    <br>
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
      <el-table-column label="Last Name" align="center">
        <template slot-scope="scope">
          {{ scope.row.lastName }}
        </template>
      </el-table-column>
      <el-table-column label="First Name" align="center">
        <template slot-scope="scope">
          {{ scope.row.firstName }}
        </template>
      </el-table-column>
      <el-table-column label="Address" align="center">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column label="City" align="center">
        <template slot-scope="scope">
          {{ scope.row.city }}
        </template>
      </el-table-column>
      <el-table-column label="State" align="center">
        <template slot-scope="scope">
          {{ scope.row.state }}
        </template>
      </el-table-column>
      <el-table-column label="Zipcode" align="center">
        <template slot-scope="scope">
          {{ scope.row.zipcode }}
        </template>
      </el-table-column>
      <el-table-column label="Gender" align="center">
        <template slot-scope="scope">
          {{ scope.row.gender }}
        </template>
      </el-table-column>
      <el-table-column label="Martial" align="center">
        <template slot-scope="scope">
          {{ scope.row.martial }}
        </template>
      </el-table-column>
      <el-table-column label="CustomerType" align="center">
        <template slot-scope="scope">
          {{ scope.row.customerType }}
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
          <el-input v-model.number="form.customerId" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Payment Type">
          <el-input v-model="form.paymentType" />
        </el-form-item>
        <el-form-item label="Invoice Id">
          <el-input v-model="form.invoiceId" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(form.customerId)">Submit</el-button>
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
import { customer, getCustomerId, request, sendAxios, getFetchAxios } from '@/utils/global';

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
        customerId: '',
        lastName: '',
        firstName: '',
        address: '',
        state: '',
        city: '',
        zipcode: '',
        gender: '',
        martial: '',
        customerType: '',
      },
      cId: getCustomerId(this),
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      return getFetchAxios(this, customer);
    },
    addHandle() {
      console.log('Add');
      this.editbox = true;
      this.disableInput = false;
      this.editing = -1;
      this.form.customerId = '';
      this.form.lastName = '';
      this.form.firstName = '';
      this.form.address = '';
      this.form.state = '';
      this.form.city = '';
      this.form.zipcode = '';
      this.form.gender = '';
      this.form.martial = '';
      this.form.customerType = '';
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
      this.form.lastName = form.lastName;
      this.form.firstName = form.firstName;
      this.form.address = form.address;
      this.form.state = form.state;
      this.form.city = form.city;
      this.form.zipcode = form.zipcode;
      this.form.gender = form.gender;
      this.form.martial = form.martial;
      this.form.customerType = form.customerType;
    },
    deleteHandle(id) {
      console.log('Delete: ' + id);
      this.dialogVisible = true;
      this.editing = id;
    },
    onSubmit() {
      console.log(this.form);
      const param = new URLSearchParams();
      param.append('customerId', this.form.customerId);
      param.append('lastName', this.form.lastName);
      param.append('firstName', this.form.firstName);
      param.append('address', this.form.address);
      param.append('state', this.form.state);
      param.append('city', this.form.city);
      param.append('zipcode', this.form.zipcode);
      param.append('gender', this.form.gender);
      param.append('martial', this.form.martial);
      param.append('customerType', this.form.customerType);
      if (this.disableInput === true) {
        sendAxios(this, request(customer.update) + this.form.customerId, param)
      } else {
        sendAxios(this, request(customer.add), param)
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
      param.append('customerId', this.form.customerId);
      sendAxios(this, request(customer.delete) + this.editing, param);
    }
  }
};
</script>
