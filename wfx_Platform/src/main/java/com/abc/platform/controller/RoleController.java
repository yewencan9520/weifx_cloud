package com.abc.platform.controller;

import com.abc.platform.bean.SysRole;
import com.abc.platform.bean.TreeNodeBean;
import com.abc.platform.service.RoleDaoService;
import com.abc.platform.service.TreeNodeDaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class RoleController {
    @Autowired
    private TreeNodeDaoService treeNodeDaoService;
    @Autowired
    private RoleDaoService roleDaoService;

    @RequestMapping("roles")
    public String findRolePage(Model model){
        List<SysRole> rolePage = roleDaoService.findRolePage();
        model.addAttribute("roles",rolePage);
        return "role";
    }

    /**
     * 通过角色Id查询权限
     */
    @RequestMapping("RoleTree")
    @ResponseBody
    public List<TreeNodeBean> getRoleTree(String roleId){
        List<TreeNodeBean> roles = treeNodeDaoService.findAllRoleAndUsername(roleId);
        return roles;
    }

}
