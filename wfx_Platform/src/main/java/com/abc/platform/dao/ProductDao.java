package com.abc.platform.dao;

import com.abc.platform.bean.WxbCustomer;
import com.abc.platform.bean.WxbGoodSku2;
import com.abc.platform.bean.WxbGoods;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ProductDao {

    void insertAddProduct(WxbGoods wxbGoods);

    void insertAddSku(@Param("list") List<WxbGoodSku2> list, @Param("goodsId") String goodsId);

    List<WxbGoods> findAllGoods();

    int updateSkuTopById(@Param("top") int top,@Param("goodsId") String goodsId);

    int updateSkurecomedById(@Param("recomed") int recomed,@Param("goodsId") String goodsId);

    int updateSkustatesById(@Param("state") int state,@Param("goodsId") String goodsId);

    List<WxbCustomer> findAllCustomer();

    WxbCustomer findUserById(String cId);

    void insertUser(WxbCustomer customer);

    void updateUser(WxbCustomer customer);

    void deleteUser(String customerId);


}
