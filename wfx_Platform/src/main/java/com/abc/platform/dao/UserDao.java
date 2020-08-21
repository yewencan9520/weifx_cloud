package com.abc.platform.dao;

import com.abc.platform.bean.UserInfo;


public interface UserDao {

    UserInfo findUser(String username,String pwd);

}
