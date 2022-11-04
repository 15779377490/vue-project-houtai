import request from "../../utils/request";

export function gettrademark(page, limit) {
  return request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: "get",
  });
}
export function addtrademark(tradeMark) {
  if (tradeMark.id) {
    return request({
      url: "/admin/product/baseTrademark/update",
      data: tradeMark,
      method: "put",
    });
  } else {
    return request({
      url: "/admin/product/baseTrademark/save",
      data: tradeMark,
      method: "post",
    });
  }
}
export function deletetrademark(id) {
  return request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: "delete",
  });
}
