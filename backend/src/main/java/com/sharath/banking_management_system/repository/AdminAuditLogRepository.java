package com.sharath.banking_management_system.repository;

import com.sharath.banking_management_system.entity.AdminAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdminAuditLogRepository
        extends JpaRepository<AdminAuditLog, Long> {

    List<AdminAuditLog> findAllByOrderByTimestampDesc();
}