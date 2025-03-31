import request from '@/config/axios'

// 获取Grafana URL
export function getGrafanaUrl(url: string) {
  return request.get({
    url: url
  });
}

// 如果需要，可以保留此方法以兼容现有代码，但实际上不再需要
export function callbackQuest(url) {
  console.log('callbackQuest method called but not needed anymore');
  return Promise.resolve();
}

