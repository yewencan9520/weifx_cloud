package com.abc.platform.service.Impl;

import com.abc.platform.bean.JsonResult;
import com.abc.platform.bean.State;
import com.abc.platform.bean.TreeNodeBean;
import com.abc.platform.dao.TreeNodeDao;
import com.abc.platform.service.TreeNodeDaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TreeNodeDaoServiceImpl implements TreeNodeDaoService {

    @Autowired
    private TreeNodeDao treeNodeDao;
    @Override
    public TreeNodeBean findTreeNodeByUsername(String username) {
        TreeNodeBean beans = treeNodeDao.findTreeNodeByUsername(username);
        return beans;
    }

    @Override
    public List<TreeNodeBean> findAllRoleAndUsername(String RoleId) {
        TreeNodeBean allRole = treeNodeDao.findAllRole();
        List<String> roles = treeNodeDao.findRoleByUsername(RoleId);

        List<TreeNodeBean> nodes = allRole.getNodes();
        for (int i = 0; i < nodes.size(); i++) {
            TreeNodeBean nodeBean = nodes.get(i);
            String text = nodeBean.getText();
            if(roles.contains(text)){
                State state = new State();
                state.setChecked(true);
                nodeBean.setState(state);
            }
            List<TreeNodeBean> nodes1 = nodeBean.getNodes();
            for (int j = 0; j < nodes1.size(); j++) {
                TreeNodeBean nodeBean1 = nodes1.get(j);
                String text1 = nodeBean1.getText();
                if(roles.contains(text1)){
                    State state = new State();
                    state.setChecked(true);
                    nodeBean1.setState(state);
                }
                List<TreeNodeBean> nodes2 = nodeBean1.getNodes();
                if (nodes2 != null && !nodes2.isEmpty()) {
                    for (int k = 0; k < nodes2.size(); k++) {
                        TreeNodeBean nodeBean2 = nodes2.get(k);
                        String text2 = nodeBean2.getText();
                        if(roles.contains(text2)){
                            State state = new State();
                            state.setChecked(true);
                            nodeBean2.setState(state);
                        }
                    }
                }
            }
        }
        return allRole.getNodes();
    }

}
