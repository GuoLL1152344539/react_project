//所有课程相关的请求都在此发出
import request from "@/utils/request";

const BASE_URL = "/admin/edu/subject";

/**
 * @author lei
 */
export function reqAllNo1Subject() {
  return request({
    url:BASE_URL,
    method:'GET',
  })
}
/**
 * @author lei
 * @param {第几页} page
 * @param {页大小} pagesize
 */
export function reqNo1SubjectPagination(page,pagesize) {
  return request({
    url:`${BASE_URL}/${page}/${pagesize}`,
    method:'GET',
  })
}