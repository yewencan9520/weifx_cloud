package com.abc.platform.service.Impl;

import com.abc.platform.bean.WxbOrder;
import com.abc.platform.dao.OrderDao;
import com.abc.platform.service.OrderDaoService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class OrderDaoServiceImpl implements OrderDaoService {

    @Resource
    private OrderDao orderDao;

    @Override
    public List<WxbOrder> findAllOrder() {
        List<WxbOrder> allOrder = orderDao.findAllOrder();
        return allOrder;
    }
}
