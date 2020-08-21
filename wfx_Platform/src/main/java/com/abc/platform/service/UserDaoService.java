package com.abc.platform.service;

import com.abc.platform.bean.UserInfo;

public interface UserDaoService {

    UserInfo findUser(String username,String pwd) throws Exception;
}
