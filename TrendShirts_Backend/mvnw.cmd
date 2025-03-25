:::
@echo off
setlocal

set MAVEN_HOME=%~dp0\.mvn\wra
set MAVEN_OPTS=-Xmx1024m -XX:MaxPermSize=256m

if exist "%MAVEN_HOME%\bin\mvn" (
    "%MAVEN_HOME%\bin\mvn" %*
) else (
    echo "Maven is not installed. Please install Maven to use this script."
)

endlocal
:::