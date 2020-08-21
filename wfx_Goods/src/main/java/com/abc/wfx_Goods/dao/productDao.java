package com.abc.wfx_Goods.dao;


import com.abc.wfx_Goods.bean.WxbGoodSku2;
import com.abc.wfx_Goods.bean.WxbGoods;
import org.apache.ibatis.annotations.Param;

import java.util.List;


public interface productDao {

    void insertAddProduct(WxbGoods wxbGoods);

    void insertAddSku(@Param("list") List<WxbGoodSku2> list, @Param("goodsId") String goodsId);


}
