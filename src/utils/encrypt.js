import CryptoJS from 'crypto-js';

const KP = {
  key: '1234567812345678', // 秘钥 16*n:
  iv: '1234567812345678' // 偏移量
};

function getAesString(data, key, iv) { // 加密
  key = CryptoJS.enc.Utf8.parse(key);
  // alert(key）;
  iv = CryptoJS.enc.Utf8.parse(iv);
  const encrypted = CryptoJS.AES.encrypt(data, key,
    {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
  return encrypted.toString(); // 返回的是base64格式的密文
}

function getDAesString(encrypted, key, iv) { // 解密
  key = CryptoJS.enc.Utf8.parse(key);
  iv = CryptoJS.enc.Utf8.parse(iv);
  const decrypted = CryptoJS.AES.decrypt(encrypted, key,
    {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
  return decrypted.toString(CryptoJS.enc.Utf8); //
}

// AES 对称秘钥加密
const aes = {
  en: (data) => getAesString(data, KP.key, KP.iv),
  de: (data) => getDAesString(data, KP.key, KP.iv)
};
// BASE64
const base64 = {
  en: (data) => CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data)),
  de: (data) => CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8)
};
// SHA256
const sha256 = (data) => {
  return CryptoJS.SHA256(data).toString();
};
// MD5
const md5 = (data) => {
  return CryptoJS.MD5(data).toString();
};

/**
 * 签名
 * @param token 身份令牌
 * @param timestamp 签名时间戳
 * @param data 签名数据
 */
const sign = (token, timestamp, data) => {
  // 签名格式： timestamp + token + data(字典升序)
  const ret = [];
  for (const it in data) {
    let val = data[it];
    if (typeof val === 'object' && //
      (!(val instanceof Array) || (val.length > 0 && (typeof val[0] === 'object')))) {
      val = JSON.stringify(val);
    }
    ret.push(it + val);
  }
  // 字典升序
  ret.sort();
  const signsrc = timestamp + token + ret.join('');
  return md5(signsrc);
};
export {
  aes,
  md5,
  sha256,
  base64,
  sign
};
