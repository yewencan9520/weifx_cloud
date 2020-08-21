package com.abc.platform.controller;


import com.abc.platform.bean.JsonResult;
import com.abc.platform.bean.TreeNodeBean;
import com.abc.platform.bean.UserInfo;
import com.abc.platform.service.TreeNodeDaoService;
import com.abc.platform.service.UserDaoService;
import org.apache.shiro.crypto.hash.Md5Hash;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class UserController {

    @Autowired
    private TreeNodeDaoService treeNodeDaoService;
    @Autowired
    private UserDaoService userDaoService;

    @RequestMapping("login")
    @ResponseBody
    public JsonResult login(String username, String password){
        JsonResult jsonResult = new JsonResult();
        try {
            String pwd = new Md5Hash(password).toHex();
            UserInfo user = userDaoService.findUser(username, pwd);
            jsonResult.setCode(0);
            jsonResult.setObj("page/index");
            return jsonResult;
        }catch (Exception e){
            jsonResult.setCode(1);
            jsonResult.setObj("账号或密码错误，请重新登陆！");
            return jsonResult;
        }
    }

    @RequestMapping("tree")
    @ResponseBody
    public TreeNodeBean treeNode(){
//        String username = SecurityUtils.getSubject().getPrincipal().toString();
        TreeNodeBean beans = treeNodeDaoService.findTreeNodeByUsername("admin");
        return beans;
    }

}
