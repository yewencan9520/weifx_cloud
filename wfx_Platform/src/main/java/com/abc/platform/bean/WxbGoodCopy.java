package com.abc.platform.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WxbGoodCopy {

  private String copyTitle;
  private String copyLink;
  private String copyContent;
  private String customerId;
  private Integer orderNo;
  private Integer typeId;
  private Integer copyId;
  private String goodsId;
  private String restIds;
  private String imgUrl1;
  private String wenanId;
  private String wenanFl;



}
