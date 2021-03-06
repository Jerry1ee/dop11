package com.clsaa.dop.server.test.model.param;

import com.clsaa.dop.server.test.enums.CaseType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author xihao
 * @version 1.0
 * @since 06/05/2019
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CaseUnitParam {

    private Long groupId;

    private CaseType caseType;

    private Long caseId;

    private String caseName;
}
