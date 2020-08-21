package com.abc.platform.service.Impl;

import com.abc.platform.bean.SysRole;
import com.abc.platform.dao.RoleDao;
import com.abc.platform.service.RoleDaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleDaoServiceImpl implements RoleDaoService {
    @Autowired
    private RoleDao roleDao;
    @Override
    public List<SysRole> findRolePage() {
        List<SysRole> rolePage = roleDao.findRolePage();
        return rolePage;
    }
}
