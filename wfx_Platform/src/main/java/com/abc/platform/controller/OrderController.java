package com.abc.platform.controller;

import com.abc.platform.bean.WxbOrder;
import com.abc.platform.service.OrderDaoService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.annotation.Resource;
import java.util.List;

@Controller
public class OrderController {

    @Resource
    private OrderDaoService orderDaoService;

    @RequestMapping("allOrder")
    public String AllOrder(Model model){
        List<WxbOrder> allOrder = orderDaoService.findAllOrder();
        model.addAttribute("order",allOrder);
        return "order";
    }

}
