package com.sharath.banking_management_system.service;

import com.sharath.banking_management_system.entity.AdminAuditLog;

import java.util.List;

public interface AdminAuditLogService {

    AdminAuditLog log(
            String adminEmail,
            String action,
            String targetType,
            Long targetId,
            String description
    );

    List<AdminAuditLog> getAllLogs();
}