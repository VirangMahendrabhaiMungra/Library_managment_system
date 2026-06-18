import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class DbCheck {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/smart_library?useSSL=false&serverTimezone=UTC";
        String user = "root";
        String pass = "root";

        try (Connection conn = DriverManager.getConnection(url, user, pass);
             Statement stmt = conn.createStatement()) {

            System.out.println("--- ROLES TABLE ---");
            ResultSet rs = stmt.executeQuery("SELECT * FROM roles");
            while (rs.next()) {
                System.out.println("ID: " + rs.getLong("id") + ", Name: " + rs.getString("name"));
            }

            System.out.println("--- USERS TABLE ---");
            ResultSet rs2 = stmt.executeQuery("SELECT * FROM users");
            while (rs2.next()) {
                System.out.println("ID: " + rs2.getLong("id") + ", Username: " + rs2.getString("username"));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
