const MODE = import.meta.env.MODE // 环境变量

export const baseUrl =
  MODE == 'development' ? '/api' : 'http://monkee.online:7009'
