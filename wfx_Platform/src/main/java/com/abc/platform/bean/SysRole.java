package com.abc.platform.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SysRole {

  private String roleCode;
  private String roleName;
  private String roleDesc;
  private String roleOrder;
  private String roleType;
  private String infoName;

}
