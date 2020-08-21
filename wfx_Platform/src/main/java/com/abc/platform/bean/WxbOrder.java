package com.abc.platform.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WxbOrder {

  private Integer oid;
  private String orderId;
  private String buyerPhone;
  private String goodId;
  private java.sql.Timestamp orderTime;
  private String channelId;
  private Integer state;
  private Integer buyNum;
  private String province;
  private String city;
  private String area;
  private String buyerReamrk;
  private Integer payType;
  private String buyerName;
  private String skuId;
  private String userId;
  private String address;
  private String courierId;
  private String orderRemark;
  private String senderType;
  private Integer orderType;
  private String adminRemark;
  private String operator;
  private java.sql.Timestamp checkTime;
  private String orderIp;
  private java.sql.Timestamp updateTime;
  private String alipayState;
  private Integer isfk;
  private Integer kdzt;
  private String miaoshu;
  private String goodsName;
  private String skuName;
  private String customerName;


}
