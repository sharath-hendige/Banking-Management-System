package com.sharath.banking_management_system.service.impl;

import com.sharath.banking_management_system.entity.AdminAuditLog;
import com.sharath.banking_management_system.repository.AdminAuditLogRepository;
import com.sharath.banking_management_system.service.AdminAuditLogService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminAuditLogServiceImpl
        implements AdminAuditLogService {

    private final AdminAuditLogRepository auditLogRepository;

    public AdminAuditLogServiceImpl(
            AdminAuditLogRepository auditLogRepository) {

        this.auditLogRepository = auditLogRepository;
    }

    @Override
    public AdminAuditLog log(
            String adminEmail,
            String action,
            String targetType,
            Long targetId,
            String description) {

        AdminAuditLog auditLog = new AdminAuditLog();

        auditLog.setAdminEmail(adminEmail);
        auditLog.setAction(action);
        auditLog.setTargetType(targetType);
        auditLog.setTargetId(targetId);
        auditLog.setDescription(description);

        return auditLogRepository.save(auditLog);
    }

    @Override
    public List<AdminAuditLog> getAllLogs() {

        return auditLogRepository
                .findAllByOrderByTimestampDesc();
    }
}