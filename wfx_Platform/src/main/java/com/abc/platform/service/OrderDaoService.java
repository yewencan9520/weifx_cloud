package com.abc.platform.service;

import com.abc.platform.bean.WxbOrder;

import java.util.List;

public interface OrderDaoService {

    List<WxbOrder> findAllOrder();
}
