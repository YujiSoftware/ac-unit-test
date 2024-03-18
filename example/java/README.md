# How to execute

## Setup

```
curl -o junit.jar https://repo1.maven.org/maven2/org/junit/platform/junit-platform-console-standalone/1.10.0/junit-platform-console-standalone-1.10.0.jar
```

## Run

```
javac -cp junit.jar Main.java MainTest.java
java -jar junit.jar execute --scan-classpath . -cp .
```
