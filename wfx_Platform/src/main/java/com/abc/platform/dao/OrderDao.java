package com.abc.platform.dao;

import com.abc.platform.bean.WxbOrder;

import java.util.List;

public interface OrderDao {

    List<WxbOrder> findAllOrder();

}
