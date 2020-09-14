import request from '@/utils/request'

const BASE_URL = "/admin/edu/lesson";

export function reqAllLessonListByCourseId(courseId) {
  return request({
    url: `${BASE_URL}/get/${courseId}`,
    method: "GET",
  });
}