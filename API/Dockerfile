# ==============================================================================
# Stage 1: Build do Back-end Spring Boot (Java 21 + Maven)
# ==============================================================================
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /build

# Copia apenas o pom.xml primeiro para aproveitar cache de dependencias
COPY backend/pom.xml ./pom.xml
RUN mvn dependency:go-offline -B

# Copia o codigo-fonte e empacota o JAR executavel
COPY backend/src ./src
RUN mvn clean package -DskipTests -B

# ==============================================================================
# Stage 2: Runtime leve (Java 21 JRE + Python 3 para o Scraper Gupy & IA)
# ==============================================================================
FROM eclipse-temurin:21-jre-jammy

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 ca-certificates curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copia o JAR compilado e o servico Python (usa apenas stdlib do Python 3)
COPY --from=builder /build/target/*.jar /app/app.jar
COPY python-service /app/python-service

ENV PORT=8082
ENV PYTHON_CMD=python3
ENV SYNC_TOKEN=jobsearch-internal-sync-token-2026

EXPOSE 8082

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
