package com.abc.wfx_Goods.service;


import com.abc.wfx_Goods.bean.JsonResult;
import com.abc.wfx_Goods.bean.ResultOv;
import org.springframework.web.multipart.MultipartFile;


public interface productDaoService {

    JsonResult insertPic(MultipartFile file);

    void insertData(ResultOv resultOv) throws Exception;

}
