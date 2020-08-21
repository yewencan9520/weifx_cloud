package com.abc.platform.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInfo {

  private String userId;
  private String account;
  private String username;
  private String password;
  private String remark;
  private String userType;
  private String enabled;
  private java.sql.Timestamp loginTime;
  private String roleId;
  private String self;


}
