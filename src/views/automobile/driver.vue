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
          {{ scope.row.driverId }}
        </template>
      </el-table-column>
      <el-table-column label="Driver License" align="center">
        <template slot-scope="scope">
          {{ scope.row.licenseNo }}
        </template>
      </el-table-column>
      <el-table-column label="Last Name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.lastName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="First Name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.firstName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Birth Date" align="center">
        <template slot-scope="scope">
          {{ getDateFromDate(scope.row.birthdate) }}
        </template>
      </el-table-column>
      <el-table-column label="Edit" width="80" align="center" v-if="role === 'admin'">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle plain @click="editHandle(scope.row.driverId)" />
        </template>
      </el-table-column>
      <el-table-column label="Delete" width="80" align="center" v-if="role === 'admin'">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" circle plain @click="deleteHandle(scope.row.driverId)" />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="Edit Box"
      :visible.sync="editbox"
      width="30%"
    >
      <el-form ref="form" :model="form" label-width="150px">
        <el-form-item label="Driver ID">
          <el-input v-model="form.driverId" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="Driver License">
          <el-input v-model="form.licenseNo" />
        </el-form-item>
        <el-form-item label="Last Name">
          <el-input v-model="form.lastName" />
        </el-form-item>
        <el-form-item label="First Name">
          <el-input v-model="form.firstName" />
        </el-form-item>
        <el-form-item label="Birth Date">
          <el-date-picker
            v-model="form.birthdate"
            type="date"
            placeholder="Select Date"
          />
        </el-form-item>
        <el-form-item label="Automobile ID">
          <el-input v-model="form.automobileId" />
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
  driver,
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
      options: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
      editbox: false,
      dialogVisible: false,
      editing: -1,
      disableInput: true,
      form: {
        driverId: '',
        licenseNo: '',
        lastName: '',
        firstName: '',
        birthdate: '',
        automobileId: ''
      },
      role: getUserRole(this),
      cId: getCustomerId(this),
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    getDateFromDate(timeStamp) {
      return getDateFromDate(timeStamp);
    },
    fetchData() {
      getFetchAxios(this, driver);
    },
    addHandle() {
      console.log('Add');
      this.editbox = true;
      this.disableInput = false;
      this.editing = -1;
      this.form.driverId = '';
      this.form.licenseNo = '';
      this.form.lastName = '';
      this.form.firstName = '';
      this.form.birthdate = '';
      this.form.automobileId = '';
    },
    getObject(id) {
      for (let i = 0; i < this.list.length; i++) {
        if (id === this.list[i].driverId) {
          return this.list[i];
        }
      }
    },
    editHandle(id) {
      console.log('Edit: ' + id);
      this.editbox = true;
      this.disableInput = true;
      this.editing = id;
      let form = this.getObject(id)
      this.form.driverId = form.driverId;
      this.form.licenseNo = form.licenseNo;
      this.form.lastName = form.lastName;
      this.form.firstName = form.firstName;
      this.form.birthdate = form.birthdate;
      this.form.automobileId = form.automobileId;
    },
    deleteHandle(id) {
      console.log('Delete: ' + id);
      this.dialogVisible = true;
      this.editing = id;
    },
    onSubmit() {
      console.log(this.form);
      const param = new URLSearchParams();
      param.append('driverId', this.form.driverId);
      param.append('licenseNo', this.form.licenseNo);
      param.append('lastName', this.form.lastName);
      param.append('firstName', this.form.firstName);
      param.append('birthdate', getDateFromDate(this.form.birthdate));
      param.append('automobileId', this.form.automobileId);
      if (this.disableInput === true) {
        sendAxios(this,request(driver.update) + this.editing, param)
      } else {
        sendAxios(this,request(driver.add), param)
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
      param.append('driverId', this.editing);
      sendAxios(this, request(driver.delete) + this.editing,param);
    }
  }
};
</script>
