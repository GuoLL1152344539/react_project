import request from '@/utils/request'

const BASE_URL = "/admin/edu/chapter";

export function reqChapterListByCourseId(page, pageSize, courseId) {
  return request({
    url: `${BASE_URL}/${page}/${pageSize}`,
    method: "GET",
    params:{courseId}
  });
}