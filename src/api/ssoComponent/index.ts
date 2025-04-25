import request from '@/config/axios'

// 发起授权
export const authorize = (
  responseType: string,
  clientId: string,
  redirectUri: string,
  state: string
) => {
  // const tenantId = localStorage.getItem('tenant-id') || '1'; // 默认租户 ID
  // 发起请求
  return request.get({
    url: '/system/oidc/authorize',
    headers: {
      // 'tenant-id': tenantId,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: {
      response_type: responseType,
      client_id: clientId,
      redirect_uri: redirectUri,
      state: state
    }
  })
}
