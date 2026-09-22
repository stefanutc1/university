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
    private String primaryLogPath = "./logs/security.log";

    @Value("${bank.security.fallback-log-file-path:./logs/security.log}")
    private String fallbackLogPath = "./logs/security.log";

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
        String path = (primaryLogPath != null && !primaryLogPath.isBlank()) ? primaryLogPath : "./logs/security.log";
        String fallback = (fallbackLogPath != null && !fallbackLogPath.isBlank()) ? fallbackLogPath : "./logs/security.log";

        File targetFile = new File(path);
        boolean usePrimary = false;

        try {
            File parent = targetFile.getParentFile();
            if (parent != null) {
                if (!parent.exists()) {
                    usePrimary = parent.mkdirs();
                } else {
                    usePrimary = parent.canWrite();
                }
            } else {
                usePrimary = true;
            }
        } catch (Exception ignored) {
            usePrimary = false;
        }

        if (!usePrimary) {
            targetFile = new File(fallback);
            File fbParent = targetFile.getParentFile();
            if (fbParent != null && !fbParent.exists()) {
                fbParent.mkdirs();
            }
        }

        try (FileWriter fw = new FileWriter(targetFile, true);
             PrintWriter pw = new PrintWriter(fw)) {
            pw.println(jsonLine);
        } catch (Exception e) {
            try {
                File fb = new File(fallback);
                if (fb.getParentFile() != null && !fb.getParentFile().exists()) {
                    fb.getParentFile().mkdirs();
                }
                try (FileWriter fw = new FileWriter(fb, true);
                     PrintWriter pw = new PrintWriter(fw)) {
                    pw.println(jsonLine);
                }
            } catch (Exception ex) {
                log.warn("Nu s-a putut scrie in fisierul de audit: {}", ex.getMessage());
            }
        }
    }

    public List<Map<String, Object>> getRecentLogs() {
        return new ArrayList<>(recentLogs);
    }
}
