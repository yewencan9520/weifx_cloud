package com.abc.platform.service.Impl;

import com.abc.platform.bean.WxbCustomer;
import com.abc.platform.bean.WxbGoods;
import com.abc.platform.dao.ProductDao;
import com.abc.platform.service.ProductDaoService;
import org.apache.shiro.crypto.hash.Md5Hash;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.sql.Timestamp;
import java.util.List;
import java.util.Random;

@Service
public class ProductDaoServiceImpl implements ProductDaoService {

    @Resource
    private ProductDao ProductDao;

    /**
     * 商品信息管理首页
     */
    @Override
    public List<WxbGoods>  findAllGoods() {
        List<WxbGoods>  allGoods = ProductDao.findAllGoods();
        return allGoods;
    }

    /**
     * 套餐置顶/取消置顶操作
     */
    @Override
    public int updateSkuTopById(int top,String goodsId) {
        int top1 = ProductDao.updateSkuTopById(top, goodsId);
        return top1;
    }
    /**
     * 套餐推荐/取消推荐操作
     */
    @Override
    public int updateSkurecomedById(int recomed,String goodsId) {
        int recomeds = ProductDao.updateSkurecomedById(recomed, goodsId);
        return recomeds;
    }
    /**
     * 套餐上架下架操作
     */
    @Override
    public int updateSkustatesById(int state,String goodsId) {
        int states = ProductDao.updateSkustatesById(state, goodsId);
        return states;
    }

    /**
     * 查询所有的商户
     */
    @Override
    public List<WxbCustomer> findAllCustomer() {
        List<WxbCustomer> customer = ProductDao.findAllCustomer();
        return customer;
    }

    /**
     * 查询商户
     */
    @Override
    public WxbCustomer findUserById(String cId) {
        WxbCustomer customer = ProductDao.findUserById(cId);
        return customer;
    }

    /**
     * 新增商户
     */
    @Override
    public void insertUser(WxbCustomer customer) {
        //生成ID
        String cId = String.valueOf(new Random().nextInt(10000000));
        customer.setCustomerId(cId);
        //生成时间
        customer.setCreatetime(new Timestamp(System.currentTimeMillis()));
        //密码加密
        String pwd = new Md5Hash(customer.getLoginPwd()).toHex();
        customer.setLoginPwd(pwd);
        ProductDao.insertUser(customer);
    }

    /**
     * 修改商户
     */
    @Override
    public void updateUser(WxbCustomer customer) {
        //密码加密
        String pwd = new Md5Hash(customer.getLoginPwd()).toHex();
        customer.setLoginPwd(pwd);
        //重置时间
        customer.setUpdateTime(new Timestamp(System.currentTimeMillis()));
        ProductDao.updateUser(customer);
    }

    @Override
    public void deleteUser(String customerId) {
        ProductDao.deleteUser(customerId);
    }


}
