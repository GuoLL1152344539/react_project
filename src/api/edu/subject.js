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

export function reqNo1SubjectPagination(page,pagesize) {// 获取一级分类数据
  return request({
    url:`${BASE_URL}/${page}/${pagesize}`,
    method:'GET',
  })
}
/**
 * @author lei
 * @param {一级分类的id} no1SubjectId 
 */
export function reqAllNo2SubjectByNo1Id(no1SubjectId) {// 获取二级分类
  return request({
    url:`${BASE_URL}/get/${no1SubjectId}`,
    method:'GET',
  })
}

/**
 * @author lei
 * @param {id} id 
 * @param {名字} title 
 * 
 */
export function reqUpdateSubject(id,title) {// 获取二级分类
  return request({
    url:`${BASE_URL}/update`,
    method:'PUT',
    data:{
      id,
      title
    }
  })
}

/**
 * @author lei
 * @param {要删除分类的id} id 
 * 
 */
export function reqDeleteSubject(id) {// 获取二级分类
  return request({
    url:`${BASE_URL}/remove/${id}`,
    method:'DELETE',
  })
}

/**
 * @author lei
 * @param {要删除分类的id} id 
 * 
 */
export function reqAddSubject({title,parentId}) {// 获取二级分类
  return request({
    url:`${BASE_URL}/save`,
    method:'POST',
    data:{
      title,
      parentId
    }
  })
}