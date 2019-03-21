package com.clsaa.dop.server.permission.service;

import com.clsaa.dop.server.permission.config.BizCodes;
import com.clsaa.dop.server.permission.dao.UserRuleDAO;
import com.clsaa.dop.server.permission.model.bo.UserRuleBoV1;
import com.clsaa.dop.server.permission.model.po.Role;
import com.clsaa.dop.server.permission.model.po.UserRule;
import com.clsaa.dop.server.permission.model.vo.PermissionV1;
import com.clsaa.dop.server.permission.model.vo.RoleV1;
import com.clsaa.dop.server.permission.model.vo.UserRuleV1;
import com.clsaa.rest.result.Pagination;
import com.clsaa.rest.result.bizassert.BizAssert;
import org.springframework.beans.factory.BeanClassLoaderAware;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.clsaa.dop.server.permission.util.BeanUtils;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 *  用户数据规则表的增删改查
 *
 * @author lzy
 *
 * @since 2019.3.19
 */

@Service
public class UserRuleService {

    @Autowired
    private UserRuleDAO userRuleDAO;

    /* *
     *
     *  * @param roleId 角色ID
     *  * @param fieldName 权限作用域参数名
     *  * @param rule 数据规则
     *
     *  * @param ctime 创建时间
     *  * @param mtime 修改时间
     *  * @param cuser 创建人
     *  * @param muser 修改人
     *  * @param deleted 删除标记
     *
     * since :2019.3.19
     */
    public void addRule(Long roleId,String fieldName,String rule,Long cuser,Long muser)
    {
        UserRule existUserRule=userRuleDAO.findByRoleIdAndFieldNameAndRule(roleId,fieldName,rule);
        BizAssert.allowed(existUserRule==null, BizCodes.REPETITIVE_RULE);
        UserRule userRule=UserRule.builder()
                .roleId(roleId)
                .fieldName(fieldName)
                .rule(rule)
                .cuser(cuser)
                .muser(muser)
                .ctime(LocalDateTime.now())
                .mtime(LocalDateTime.now())
                .build();
        userRuleDAO.saveAndFlush(userRule);
    }

    //查找唯一规则
    public UserRuleBoV1 findUniqueRule(String rule, String fieldName, Long roleId)
    {
        return BeanUtils.convertType(userRuleDAO.findByRoleIdAndFieldNameAndRule(roleId,fieldName,rule),UserRuleBoV1.class);
    }

    //
    //分页查询所有规则
    public Pagination<UserRuleV1> getUserRuleV1Pagination(Integer pageNo, Integer pageSize)
    {
        Sort sort = new Sort(Sort.Direction.DESC, "mtime");
        int count = (int) this.userRuleDAO.count();

        Pagination<UserRuleV1> pagination = new Pagination<>();
        pagination.setPageNo(pageNo);
        pagination.setPageSize(pageSize);
        pagination.setTotalCount(count);

        if (count == 0) {
            pagination.setPageList(Collections.emptyList());
            return pagination;
        }

        Pageable pageRequest = PageRequest.of(pagination.getPageNo() - 1, pagination.getPageSize(), sort);
        List<UserRule> userRuleList = this.userRuleDAO.findAll(pageRequest).getContent();
        pagination.setPageList(userRuleList.stream().map(p -> BeanUtils.convertType(p, UserRuleV1.class)).collect(Collectors.toList()));
        return pagination;
    }
    //根据角色ID查找规则
    public List<UserRuleBoV1> findByRoleId(Long roleId)
    {
        List<UserRule> userRuleList= userRuleDAO.findByRoleId(roleId);
        return userRuleList.stream().map(p -> BeanUtils.convertType(p, UserRuleBoV1.class)).collect(Collectors.toList());
    }

    //根据ID删除规则
    @Transactional
    public void deleteById(Long id)
    {
        userRuleDAO.deleteById(id);
    }

    //根据角色ID删除规则
    @Transactional
    public void deleteByRoleId(Long roleId)
    {
        userRuleDAO.deleteByRoleId(roleId);
    }

}
