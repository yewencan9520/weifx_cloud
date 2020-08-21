package com.abc.platform.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("page")
public class PageController {

    @RequestMapping("login")
    public String toLogin() {
        return "login";
    }

    @RequestMapping("index")
    public String toindex() {
        return "index";
    }

    @RequestMapping("gUserAdd")
    public String toGoodUserAdd() {
        return "goodsUserAdd";
    }

    @RequestMapping("goodsAdd")
    public String toGoodAdd() {
        return "goodsAdd";
    }

    @RequestMapping("goodsInfo")
    public String toGoodInfo() {
        return "goodsInfo";
    }

}
