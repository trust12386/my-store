module.exports = (vm) => {
  // 初始化请求配置
  uni.$u.http.setConfig((config) => {
    /* config 为默认全局配置*/
    config.baseURL = 'http://localhost:3500'; /* 根域名 */
    return config
  })
}