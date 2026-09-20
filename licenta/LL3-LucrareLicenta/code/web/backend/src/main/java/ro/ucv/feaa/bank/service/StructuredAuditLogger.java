package ro.ucv.feaa.bank.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentLinkedDeque;

@Service
public class StructuredAuditLogger {
    private static final Logger log = LoggerFactory.getLogger(StructuredAuditLogger.class);
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Deque<Map<String, Object>> recentLogs = new ConcurrentLinkedDeque<>();
    private static final int MAX_RECENT_LOGS = 50;

    @Value("${bank.security.log-file-path:/var/log/bank-app/security.log}")
    private String primaryLogPath;

    @Value("${bank.security.fallback-log-file-path:./logs/security.log}")
    private String fallbackLogPath;

    public void logSecurityEvent(String event, String client, String sourceIp, Map<String, Object> extraFields) {
        Map<String, Object> logEntry = new LinkedHashMap<>();
        logEntry.put("timestamp", DateTimeFormatter.ISO_INSTANT.format(Instant.now()));
        logEntry.put("event", event);
        logEntry.put("client", client != null ? client : "ANONYMOUS");
        logEntry.put("sourceIp", sourceIp != null ? sourceIp : "127.0.0.1");

        if (extraFields != null) {
            logEntry.putAll(extraFields);
        }

        // 1. Memorare in buffer pentru afisare in consola SOC a Kiosk-ului
        recentLogs.addFirst(logEntry);
        while (recentLogs.size() > MAX_RECENT_LOGS) {
            recentLogs.removeLast();
        }

        // 2. Serializare JSON si scriere in fisierul dedicat auditat de Wazuh SIEM
        try {
            String jsonLine = objectMapper.writeValueAsString(logEntry);
            log.info("[WAZUH-TELEMETRY] {}", jsonLine);
            writeLineToFile(jsonLine);
        } catch (Exception e) {
            log.error("Eroare la serializarea logului de securitate: {}", e.getMessage());
        }
    }

    private synchronized void writeLineToFile(String jsonLine) {
        File file = new File(primaryLogPath);
        File targetFile = file;

        // Daca nu avem permisiuni de scriere in /var/log, utilizam fallback local
        if (!file.getParentFile().exists() && !file.getParentFile().mkdirs()) {
            targetFile = new File(fallbackLogPath);
            if (targetFile.getParentFile() != null && !targetFile.getParentFile().exists()) {
                targetFile.getParentFile().mkdirs();
            }
        } else if (!file.canWrite() && file.exists()) {
            targetFile = new File(fallbackLogPath);
            if (targetFile.getParentFile() != null && !targetFile.getParentFile().exists()) {
                targetFile.getParentFile().mkdirs();
            }
        }

        try (FileWriter fw = new FileWriter(targetFile, true);
             PrintWriter pw = new PrintWriter(fw)) {
            pw.println(jsonLine);
        } catch (IOException e) {
            // In caz extrem scriem la fallback
            try {
                File fallback = new File(fallbackLogPath);
                if (fallback.getParentFile() != null && !fallback.getParentFile().exists()) {
                    fallback.getParentFile().mkdirs();
                }
                try (FileWriter fw = new FileWriter(fallback, true);
                     PrintWriter pw = new PrintWriter(fw)) {
                    pw.println(jsonLine);
                }
            } catch (IOException ex) {
                log.warn("Nu s-a putut scrie in fisierul de audit: {}", ex.getMessage());
            }
        }
    }

    public List<Map<String, Object>> getRecentLogs() {
        return new ArrayList<>(recentLogs);
    }
}
