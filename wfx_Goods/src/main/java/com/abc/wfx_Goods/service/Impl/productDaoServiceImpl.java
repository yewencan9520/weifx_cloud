package com.abc.wfx_Goods.service.Impl;


import com.abc.wfx_Goods.bean.JsonResult;
import com.abc.wfx_Goods.bean.ResultOv;
import com.abc.wfx_Goods.bean.WxbGoodSku2;
import com.abc.wfx_Goods.dao.productDao;
import com.abc.wfx_Goods.service.productDaoService;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.abc.wfx_Goods.bean.WxbGoods;

import javax.annotation.Resource;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Timestamp;
import java.util.List;
import java.util.Random;

@Service
public class productDaoServiceImpl implements productDaoService {

    @Resource
    private productDao productDao;

    @Override
    @Transactional(propagation = Propagation.REQUIRED)
    public void insertData(ResultOv resultOv) throws Exception{
        logs(resultOv);
        String gId = String.valueOf(new Random().nextInt(100000000));
        WxbGoods wxbGoods = resultOv.getWxbGood();
        wxbGoods.setGoodsId(gId);
        wxbGoods.setCreateTime(new Timestamp(System.currentTimeMillis()));
        AddProduct(wxbGoods);
        AddSku(resultOv.getSku2List(),wxbGoods.getGoodsId());
    }

    /**
     * 新增商品信息
     */
    @Transactional(propagation = Propagation.REQUIRED)
    public void AddProduct(WxbGoods wxbGoods){
        productDao.insertAddProduct(wxbGoods);
    }

    /**
     * 新增套餐信息
     */
    @Transactional(propagation = Propagation.REQUIRED)
    public void AddSku(List<WxbGoodSku2> sku2List,String goodsId){
        productDao.insertAddSku(sku2List,goodsId);
    }
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logs(Object obj){

    }

    /**
     * 新增图片到 nginx
     */
    @Override
    public JsonResult insertPic(MultipartFile file) {
        JsonResult jsonResult= new JsonResult();
        try {
            InputStream inputStream = file.getInputStream();
            FTPClient ftp = new FTPClient();
            //连接FTP服务器，默认端口是21
            ftp.connect("192.168.121.1",21);
            //匿名用户必须使用anonymous登录，密码是邮箱
            boolean login = ftp.login("anonymous", "1328662381@qq.com");
            int replyCode = ftp.getReplyCode();
            if (!FTPReply.isPositiveCompletion(replyCode)) {
                System.out.println("获取响应失败");
                jsonResult.setCode(1);
                return jsonResult;
            }
            //设置接收文件类型为二进制文件
            ftp.setFileType(FTPClient.BINARY_FILE_TYPE);
            //服务器上创建images文件夹
            ftp.makeDirectory("images");
            //切换ftp默认文件夹
            ftp.changeWorkingDirectory("images");

            //将本地图片上传到ftp服务器上
            ftp.storeFile(file.getOriginalFilename(), inputStream);
            //退出登录
            ftp.logout();
            jsonResult.setCode(0);
            jsonResult.setObj("http://localhost/images/"+file.getOriginalFilename());
        } catch (IOException e) {
            e.printStackTrace();
        }
        return jsonResult;
    }

}
