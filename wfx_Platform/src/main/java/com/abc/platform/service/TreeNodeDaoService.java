package com.abc.platform.service;

import com.abc.platform.bean.TreeNodeBean;

import java.util.List;

public interface TreeNodeDaoService {

    TreeNodeBean findTreeNodeByUsername(String username);

    List<TreeNodeBean> findAllRoleAndUsername(String RoleId);

}
