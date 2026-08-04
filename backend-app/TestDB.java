import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class TestDB {
    public static void main(String[] args) throws Exception {
        String url = "jdbc:postgresql://ep-mute-violet-auog6yh2-pooler.c-10.us-east-1.aws.neon.tech/neondb?sslmode=require";
        String user = "neondb_owner";
        String pass = "npg_oSJGK1bBgy7t";
        try (Connection conn = DriverManager.getConnection(url, user, pass);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT CONCAT('TH-', t.task_id) AS codigo, t.task_title AS nombre, CASE t.task_status WHEN 'todo' THEN 'Pendiente' WHEN 'in_progress' THEN 'En progreso' WHEN 'blocked' THEN 'Bloqueada' WHEN 'done' THEN 'Completada' ELSE t.task_status END AS estado, 'Sin asignar' AS responsable, CASE t.priority_level WHEN 'low' THEN 'Baja' WHEN 'medium' THEN 'Media' WHEN 'high' THEN 'Alta' ELSE t.priority_level END AS prioridad FROM tasks t GROUP BY t.task_id, t.task_title, t.task_status, t.priority_level, t.due_on ORDER BY t.due_on NULLS LAST, t.task_id")) {
            while(rs.next()) {
                System.out.println(rs.getString(1) + " : " + rs.getString(2));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
