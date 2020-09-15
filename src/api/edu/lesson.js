import request from '@/utils/request'

const BASE_URL = "/admin/edu/lesson";

export function reqAllLessonListByCourseId(courseId) {
  return request({
    url: `${BASE_URL}/get/${courseId}`,
    method: "GET",
  });
}
export function reqAllLesson({chapterId, free, title, video}) {
  return request({
    url: `${BASE_URL}/save`,
    method: "POST",
    data:{chapterId, free, title, video}
  });
}