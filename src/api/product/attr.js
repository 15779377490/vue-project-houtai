import request from "../../utils/request";
export function getcategory1() {
  return request({
    url: "/admin/product/getCategory1",
    method: "get",
  });
}
export function getcategory2(category1Id) {
  return request({
    url: `/admin/product/getCategory2/${category1Id}`,
    method: "get",
  });
}
export function getcategory3(category2Id) {
  return request({
    url: `/admin/product/getCategory3/${category2Id}`,
    method: "get",
  });
}
export function getcategory(category1Id, category2Id, category3Id) {
  return request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
  });
}
export function saveattrInfo(data) {
  return request({
    url: "/admin/product/saveAttrInfo",
    method: "post",
    data,
  });
}
