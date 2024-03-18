import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

public class MainTest {
    @Test
    public void sample1() throws Exception {
        String input = """
4""";
        String output = """
101010101""";

        judge(input, output);
    }

    @Test
    public void sample2() throws Exception {
        String input = """
1""";
        String output = """
101""";

        judge(input, output);
    }

    @Test
    public void sample3() throws Exception {
        String input = """
10""";
        String output = """
101010101010101010101""";

        judge(input, output);
    }

    private void judge(String input, String output) throws Exception {
        ByteArrayInputStream in = new ByteArrayInputStream(input.getBytes());
        System.setIn(in);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        System.setOut(new PrintStream(out));

        Main.main(new String[0]);

        Assertions.assertEquals(output + System.lineSeparator(), out.toString());
    }
}
