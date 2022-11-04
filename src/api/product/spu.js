import request from "../../utils/request";
export function getSpuList(page, limit, category3Id) {
  return request({
    url: `/admin/product/${page}/${limit}`,
    params: { category3Id },
    method: "get",
  });
}
export function getspubyid(spuId) {
  return request({
    url: `/admin/product/getSpuById/${spuId}`,
    method: "get",
  });
}
export function getTradeMark() {
  return request({
    url: "/admin/product/baseTrademark/getTrademarkList",
    method: "get",
  });
}
export function getimageList(spuId) {
  return request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: "get",
  });
}
export function getSale() {
  return request({
    url: "/admin/product/baseSaleAttrList",
    method: "get",
  });
}
export function getsaveorupdate(spuInfo) {
  if (spuInfo.id) {
    return request({
      url: "/admin/product/updateSpuInfo",
      method: "post",
      data: spuInfo,
    });
  } else {
    return request({
      url: "/admin/product/saveSpuInfo",
      method: "post",
      data: spuInfo,
    });
  }
}
export function deletespu(Id){
  return request({
    url:`/admin/product/deleteSpu/${Id}`,
    method:"delete"
  })
}
