package com.abc.wfx_Goods.controller;

import com.abc.wfx_Goods.bean.JsonResult;
import com.abc.wfx_Goods.bean.ResultOv;
import com.abc.wfx_Goods.service.productDaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class ProductController {

    @Autowired
    private productDaoService productDaoService;

    @PostMapping("save")
    public JsonResult saveData(@RequestBody ResultOv resultOv){
        JsonResult jsonResult = new JsonResult();
        try {
            productDaoService.insertData(resultOv);
            jsonResult.setCode(0);
            jsonResult.setObj("新增成功");
        } catch (Exception e) {
            jsonResult.setCode(1);
            jsonResult.setObj("新增失败，请检查！");
        }
        return jsonResult;
    }

    @RequestMapping("upload")
    public JsonResult addProduct(MultipartFile file){
        JsonResult jsonResults = productDaoService.insertPic(file);
        return jsonResults;
    }
}
