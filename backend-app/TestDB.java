import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

public class TestDB {
    private static final String TASK_SUMMARY_QUERY = """
            SELECT
                CONCAT('TH-', t.task_id) AS codigo,
                t.task_title AS nombre,
                CASE t.task_status
                    WHEN 'todo' THEN 'Pendiente'
                    WHEN 'in_progress' THEN 'En progreso'
                    WHEN 'blocked' THEN 'Bloqueada'
                    WHEN 'done' THEN 'Completada'
                    ELSE t.task_status
                END AS estado,
                'Sin asignar' AS responsable,
                CASE t.priority_level
                    WHEN 'low' THEN 'Baja'
                    WHEN 'medium' THEN 'Media'
                    WHEN 'high' THEN 'Alta'
                    ELSE t.priority_level
                END AS prioridad
            FROM tasks t
            GROUP BY t.task_id, t.task_title, t.task_status, t.priority_level, t.due_on
            ORDER BY t.due_on NULLS LAST, t.task_id
            """;

    public static void main(String[] args) throws Exception {
        Map<String, String> env = loadEnv();
        String url = value(env, "DB_URL");
        String user = value(env, "DB_USERNAME", "DB_USER");
        String pass = value(env, "DB_PASSWORD");

        try (Connection conn = DriverManager.getConnection(url, user, pass);
             Statement stmt = conn.createStatement()) {
            System.out.println("Conexion OK");

            try (ResultSet count = stmt.executeQuery("SELECT COUNT(*) FROM tasks")) {
                count.next();
                System.out.println("tasks count: " + count.getInt(1));
            }

            int rows = 0;
            try (ResultSet rs = stmt.executeQuery(TASK_SUMMARY_QUERY)) {
                while (rs.next()) {
                    rows++;
                    System.out.println(rs.getString("codigo") + " | " + rs.getString("nombre") + " | " + rs.getString("estado"));
                }
            }
            System.out.println("query rows: " + rows);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static Map<String, String> loadEnv() throws Exception {
        Map<String, String> env = new HashMap<>(System.getenv());
        Path path = Path.of(".env");
        if (!Files.exists(path)) {
            return env;
        }

        for (String line : Files.readAllLines(path)) {
            String trimmed = line.trim();
            if (trimmed.isBlank() || trimmed.startsWith("#") || !trimmed.contains("=")) {
                continue;
            }
            String[] parts = trimmed.split("=", 2);
            env.putIfAbsent(parts[0].trim(), parts[1].trim());
        }
        return env;
    }

    private static String value(Map<String, String> env, String... names) {
        for (String name : names) {
            String value = env.get(name);
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        throw new IllegalStateException("Missing required environment variable: " + String.join(" or ", names));
    }
}
