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
          {{ scope.row.automobileId }}
        </template>
      </el-table-column>
      <el-table-column label="VIN" align="center">
        <template slot-scope="scope">
          {{ scope.row.vin }}
        </template>
      </el-table-column>
      <el-table-column label="Model Made Year" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.makeModelYear }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" width="110" align="center">
        <template slot-scope="scope">
          {{ getStatus(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="Edit" width="80" align="center" v-if="role === 'admin'">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle plain @click="editHandle(scope.row.automobileId)"/>
        </template>
      </el-table-column>
      <el-table-column label="Delete" width="80" align="center" v-if="role === 'admin'">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" circle plain @click="deleteHandle(scope.row.automobileId)" />
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
          <el-input v-model="form.automobileId" :disabled="disableInput" />
        </el-form-item>
        <el-form-item label="VIN">
          <el-input v-model="form.vin" />
        </el-form-item>
        <el-form-item label="Model Made Year">
          <el-select v-model="form.makeModelYear" placeholder="Select Year">
            <el-option
              v-for="item in options"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
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
        <el-form-item label="Insurance ID">
          <el-input v-model="form.aiId" />
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
import { automobile, getCustomerId, getFetchAxios, getUserRole, request, sendAxios } from '@/utils/global';

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
      statuses: [
        { value: 'L', label: 'Leased' },
        { value: 'F', label: 'Financed' },
        { value: 'O', label: 'Owned' }
      ],
      editbox: false,
      dialogVisible: false,
      editing: -1,
      disableInput: true,
      form: {
        automobileId: '',
        vin: '',
        makeModelYear: '',
        status: '',
        aiId: ''
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
      getFetchAxios(this, automobile);
    },
    getStatus(c) {
      if (c === 'L') {
        return 'Leased';
      }
      if (c === 'F') {
        return 'Financed';
      }
      if (c === 'O') {
        return 'Owned';
      }
    },
    addHandle() {
      console.log('Add');
      this.editbox = true;
      this.disableInput = false;
      this.editing = -1;
      this.form.automobileId = '';
      this.form.vin = '';
      this.form.makeModelYear = '';
      this.form.status = '';
      this.form.aiId = '';
    },
    getObject(id) {
      for (let i = 0; i < this.list.length; i++) {
        if (id === this.list[i].automobileId) {
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
      this.form.automobileId = form.automobileId;
      this.form.vin = form.vin;
      this.form.makeModelYear = form.makeModelYear;
      this.form.status = form.status;
      this.form.aiId = form.aiId;
    },
    deleteHandle(id) {
      console.log('Delete: ' + id);
      this.dialogVisible = true;
      this.editing = id;
    },
    onSubmit() {
      console.log(this.form);
      const param = new URLSearchParams();
      param.append('automobileId', this.form.automobileId);
      param.append('vin', this.form.vin);
      param.append('makeModelYear', this.form.makeModelYear);
      param.append('status', this.form.status);
      param.append('aiId', this.form.aiId);
      if (this.disableInput === true) {
        sendAxios(this,request(automobile.update) + this.editing, param)
      } else {
        sendAxios(this,request(automobile.add), param)
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
      sendAxios(this, request(automobile.delete) + this.editing,param);
    }
  }
};
</script>
