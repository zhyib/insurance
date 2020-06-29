import axios from "axios";

export function request(url) {
  return server + prefix + url;
}

export function sendAxios(vueObject, url, param) {
  axios
    .post(url, param)
    .then((response) => {
      console.log(response);
      vueObject.fetchData();
      if (response.data.code === 0) {
        vueObject.$message.success('Submitted');
        vueObject.editbox = false;
      } else if (response.data.code === -1) {
        vueObject.$message.error('An error occurred');
      } else {
        vueObject.$message.error(response.data.msg);
      }
    })
    .catch((error) => {
      console.log(error.toString());
      vueObject.$message.error(error.toString());
    });
}

export function getFetchAxios(vueObject, className) {
  vueObject.listLoading = true;
  const param = new URLSearchParams();
  param.append('customerId', vueObject.cId);
  if (vueObject.cId !== '0') {
    axios
      .post(request(className.search + vueObject.cId), param)
      .then(response => {
        if (response.data.code === 0) {
          console.log(response.data.data);
          let result;
          if (Object.prototype.toString.call(response.data.data) !== '[object Array]') {// [object Array]
            result = [response.data.data];
          } else {
            result = response.data.data;
          }
          vueObject.listLoading = false;
          return (vueObject.list = result);
        } else if (response.data.code === -1) {
          vueObject.$message.error('An error occurred');
        } else {
          vueObject.$message.error(response.data.msg);
        }
        vueObject.listLoading = false;
      });
  } else {
    axios
      .get(request(className.getAll))
      .then(response => {
        if (response.data.code === 0) {
          console.log(response.data.data);
          vueObject.listLoading = false;
          return (vueObject.list = response.data.data);
        } else if (response.data.code === -1) {
          vueObject.$message.error('An error occurred');
        } else {
          vueObject.$message.error(response.data.msg);
        }
      });
  }
}

export function getDate(timeStamp) {
  let year = timeStamp.substring(0, 4);
  let month = timeStamp.substring(5, 7);
  let date = timeStamp.substring(8, 10);
  return month + '/' + date + '//' + year;
}

export function getDateFromDate(date) {
  let d = new Date(date);
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  let day = d.getDate();
  let monthStr;
  if (month < 10) {
    monthStr = '0' + month.toString();
  } else {
    monthStr = month.toString()
  }
  let dayStr;
  if (day < 10) {
    dayStr = '0' + day.toString();
  } else {
    dayStr = day.toString()
  }
  return monthStr + '/' + dayStr + '/' + year;
}

export function getUserRole(obj) {
  return obj.$cookies.get('user_role');
}

export function getCustomerId(obj) {
  return obj.$cookies.get('c_id');
}

export const server = 'http://localhost:8081';
export const prefix = '/api';

export const hiCustomer = {
  getAll: '/hiCustomer/getAll',
  add: '/hiCustomer/add',
  update: '/hiCustomer/update/',
  delete: '/hiCustomer/delete/',
  search: '/hiCustomer/search/',
};

export const home = {
  getAll: '/home/getAll',
  add: '/home/add',
  update: '/home/update/',
  delete: '/home/delete/',
  search: '/home/search/',
}

export const homeInvoice = {
  getAll: '/homeInvoice/getAll',
  add: '/homeInvoice/add',
  update: '/homeInvoice/update/',
  delete: '/homeInvoice/delete/',
  search: '/homeInvoice/search/',
};

export const homePayment = {
  getAll: '/homePayment/getAll',
  add: '/homePayment/add',
  update: '/homePayment/update/',
  delete: '/homePayment/delete/',
  search: '/homePayment/search/',
};

export const aiCustomer = {
  getAll: '/aiCustomer/getAll',
  add: '/aiCustomer/add',
  update: '/aiCustomer/update/',
  delete: '/aiCustomer/delete/',
  search: '/aiCustomer/search/',
};

export const automobile = {
  getAll: '/automobile/getAll',
  add: '/automobile/add',
  update: '/automobile/update/',
  delete: '/automobile/delete/',
  search: '/automobile/search/',
};

export const driver = {
  getAll: '/driver/getAll',
  add: '/driver/add',
  update: '/driver/update/',
  delete: '/driver/delete/',
  search: '/driver/search/',
};

export const automobileInvoice = {
  getAll: '/automobileInvoice/getAll',
  add: '/automobileInvoice/add',
  update: '/automobileInvoice/update/',
  delete: '/automobileInvoice/delete/',
  search: '/automobileInvoice/search/',
};

export const automobilePayment = {
  getAll: '/automobilePayment/getAll',
  add: '/automobilePayment/add',
  update: '/automobilePayment/update/',
  delete: '/automobilePayment/delete/',
  search: '/automobilePayment/search/',
};

export const customer = {
  getAll: '/customer/getAll',
  add: '/customer/add',
  update: '/customer/update/',
  delete: '/customer/delete/',
  search: '/customer/search/',
}

export const user = {
  login: '/user/login/',
  add: '/user/add',
};
