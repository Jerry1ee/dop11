package com.clsaa.dop.server.image.model.dto;

import com.clsaa.dop.server.image.model.enumtype.UserCredentialType;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import java.time.LocalDateTime;

/**
 * <p>
 * 用户凭据业务层对象
 * </p>
 *
 * @author 任贵杰 812022339@qq.com
 * @since 2019-02-20
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserCredentialDto {
    /**
     * 用户凭据id
     */
    private Long id;
    /**
     * 所属用户id
     */
    private Long userId;
    /**
     * 标识（手机号、邮箱、用户名或第三方应用的唯一标识）
     */
    private String identifier;
    /**
     * 凭据(密码或token)
     */
    private String credential;
    /**
     * 创建时间
     */
    private LocalDateTime ctime;
    /**
     * 修改时间
     */
    private LocalDateTime mtime;
    /**
     * 用户认证类型
     */
    private UserCredentialType type;
}