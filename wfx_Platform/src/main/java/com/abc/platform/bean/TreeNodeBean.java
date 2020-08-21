package com.abc.platform.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TreeNodeBean {

    private String text;
    private String href;
    private State state;

    private List<TreeNodeBean> nodes;

    public List<TreeNodeBean> getNodes() {
        if (nodes != null && nodes.isEmpty()) {
            return null;
        }
        return nodes;
    }

}
