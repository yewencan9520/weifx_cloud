package com.abc.wfx_Goods.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WxbGoodSku2 {

  private Integer skuId;
  private String skuName;
  private String skuCost;
  private String skuPrice;
  private String skuPmoney;
  private String goodId;
  private Integer orderNo;
  private String serviceMoney;


}
