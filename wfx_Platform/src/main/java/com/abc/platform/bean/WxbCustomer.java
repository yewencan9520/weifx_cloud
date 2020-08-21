package com.abc.platform.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WxbCustomer {

  private String customerId;
  private String customerName;
  private String qq;
  private String wxh;
  private String phone;
  private java.sql.Timestamp createtime;
  private String loginName;
  private String loginPwd;
  private Integer state;
  private Integer level;
  private double accBalance;
  private java.sql.Timestamp updateTime;
  private String website;

}
