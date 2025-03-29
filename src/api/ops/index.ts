import request from '@/utils/request';

export function getGrafanaUrl() {
  return request({
    url: '/admin-api/ops/grafana-url',
    method: 'get'
  });
}
