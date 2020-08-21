package com.abc.platform.dao;

import com.abc.platform.bean.TreeNodeBean;

import java.util.List;


public interface TreeNodeDao {

    TreeNodeBean findTreeNodeByUsername(String username);

    TreeNodeBean findAllRole();

    List<String> findRoleByUsername(String RoleId);

}
