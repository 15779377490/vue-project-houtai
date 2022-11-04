import request from "../../utils/request";
export function getspuImageList(spuId) {
  return request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: "get",
  });
}
export function getspusaleAttr(spuId) {
  return request({
    url: `/admin/product/spuSaleAttrList/${spuId}`,
    method: "get",
  });
}
export function getAttrInfo(category1Id, category2Id, category3Id) {
  return request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: "get",
  });
}
export function saveSkuInfo(skuInfo) {
  return request({
    url: "/admin/product/saveSkuInfo",
    method: "post",
    data: skuInfo,
  });
}
export function getskuList(spuId) {
  return request({
    url: `/admin/product/findBySpuId/${spuId}`,
    method: "get",
  });
}
export function reqskuList(page, limit) {
  return request({
    url: `/admin/product/list/${page}/${limit}`,
    method: "get",
  });
}
export function onsale(skuId) {
  return request({
    url: `/admin/product/onSale/${skuId}`,
    method: "get",
  });
}
export function cancelsale(skuId) {
  return request({
    url: `/admin/product/cancelSale/${skuId}`,
    method: "get",
  });
}
export function reqSkuById(skuId) {
  return request({
    url: `/admin/product/getSkuById/${skuId}`,
    method: "get",
  });
}
